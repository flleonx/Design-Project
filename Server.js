const express = require('express');
const { fstat } = require('fs');
var net =require('net');
var app = express();
const path = require('path');
var socketio = require('socket.io');
var latitud ='x1';
var longitud ='x2';
var stamptime ='x3';
const fs= require('fs');

// var server = require('http').Server(app);       
// var io = socketio.listen(server);

app.listen(51000);

app.use(express.static('StaticItems'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

function read(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        callback(data);
    });
}

// var hostvaluef="";
// console.log(hostvaluef)

var outputread = fs.readFileSync('Credenciales.txt','utf8');
var credenciales=outputread;
hostvalue= credenciales.split(";")[0];
uservalue= credenciales.split(";")[1];
passwordvalue= credenciales.split(";")[2];
databasevalue= credenciales.split(";")[3]; 

const mysql = require('mysql');

const database = mysql.createConnection({
     host: hostvalue,
     user: uservalue,
     password: passwordvalue,
     database: databasevalue
            });

     //Verificar conexión
    database.connect((err) => {
      if(err){  console.log("ERROR A CONTECTAR A LA DATA BASE")
          // throw err;
             }
         console.log('Connected to mydata');
       });

const dgram = require('dgram'); //DGRAM LIBRARY
const { format } = require('path');

//TRUCKS SOCKETS
const _truckS1 = dgram.createSocket('udp4');
const _truckS2 = dgram.createSocket('udp4');

//ERROR SOCKET CREATION
_truckS1.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  _truckS1.close();
});

_truckS2.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  _truckS2.close();
});

var gpsinfo=''

//UDP SOCKETS PORT:52000 --->TRUCK1    PORT:52100----->TRUCK2    GET AND SAVE DATA
_truckS1.on('message', function(msg, rinfo) {

  var latitud= msg.toString('utf8').split(";")[0]; 
  latitud=  latitud;
  var longitud= msg.toString('utf8').split(";")[1];
  longitud=  longitud;
  var timestamp= msg.toString('utf8').split(";")[2];
  timestamp= timestamp;

  timestampK = _timestampK(timestamp)

  datosget={latitud: latitud,longitud: longitud, timestamp: timestampK}
  let sql = 'INSERT INTO truck1 SET ?';
  let query = database.query(sql,datosget,(err,result) =>{
            if(err) throw err;
    })
});

_truckS2.on('message', function(msg, rinfo) {

  var latitud= msg.toString('utf8').split(";")[0]; 
  latitud=  latitud;
  var longitud= msg.toString('utf8').split(";")[1];
  longitud=  longitud;
  var timestamp= msg.toString('utf8').split(";")[2];
  timestamp= timestamp;

  timestampK = _timestampK(timestamp)

  datosget={latitud: latitud,longitud: longitud, timestamp: timestampK}
  let sql = 'INSERT INTO truck2 SET ?';
  let query = database.query(sql,datosget,(err,result) =>{
            if(err) throw err;
      })
});

//CONSOLE LOG - INFORMATION ABOUT SOCKETS
_truckS1.on('listening', () => {
  const address = _truckS1.address();
  console.log(`Truck-1 Socket Listening at: ${address.address}:${address.port}`);
});

_truckS2.on('listening', () => {
  const address = _truckS2.address();
  console.log(`Truck-2 Socket Listening at: ${address.address}:${address.port}`);
});


// Llamar POST

app.get('/', (request, response) => {
  response.writeHead(200, {'content-type': 'text/html'});
  var file = fs.createReadStream('index.html');
  file.pipe(response);
});

var _tableT1;
var _tableT2;

app.get('/actualcoords', function(req, res) {

  let sqlT1 = 'SELECT * FROM truck1 WHERE Entrada = (SELECT MAX(Entrada)  FROM truck1)'
  let queryT1 = database.query(sqlT1, (err1, output1) => {
      if (err1) throw err1;
      //UNDEFINED CORRECTION ---> NO NULL ARGUMENTS WITHIN THE JSON FUNCTION
      if (output1[0] != null){
        _tableT1 = (JSON.stringify(output1[0]));
        _tableT1 = JSON.parse(_tableT1);
      }
  });

  let sqlT2 = 'SELECT * FROM truck2 WHERE Entrada = (SELECT MAX(Entrada)  FROM truck2)'
  let queryT2 = database.query(sqlT2, (err2, output2) => {
      if (err2) throw err2;
      if (output2[0] != null){
      _tableT2 = (JSON.stringify(output2[0]));
      _tableT2 = JSON.parse(_tableT2);
      }
  });
    // console.log([_tableT2,_tableT1])

    res.end(JSON.stringify([_tableT1,_tableT2]));
});


app.post('/intervalo/:usertruck', function (req,res) {

  console.log("REQUEST CAMIÓN: "+ req.params.usertruck) 
  
  var Start = req.body.start;
  var Finish = req.body.end;

  Start = _timestampKU(Start);
  Finish = _timestampKU(Finish);

  //PARAM
  let sql = `SELECT latitud, longitud, timestamp FROM truck${req.params.usertruck} WHERE timestamp BETWEEN '${Start}' and '${Finish}'`;
    let query = database.query(sql, (err, output) => {
        if(err){ throw err;}
        // console.log(output);
      res.end(JSON.stringify(output))
});

});

//TRUCKS SOCKETS STAMENT
_truckS1.bind(52000);
_truckS2.bind(52100);
// server.listen(51000, () => {
//   console.log("Servidor en puerto 51000");
// });

function _timestampK(_String){
  var xFormat = _String.split(" ");
  var xFormattime = xFormat[0].split("/")
  // var xFormathour = xFormat[1].split(":")
  _String = xFormattime[2]+"/"+xFormattime[1]+"/"+xFormattime[0]+" "+xFormat[1]
  // +xFormathour[0]+xFormathour[1]+xFormathour[2]
  return _String
}

function _timestampKU(_String){
  var xFormat = _String.split(" ");
  var xFormattime = xFormat[0].split("/")
  // var xFormathour = xFormat[1].split(":")
  _String = xFormattime[2]+"/"+xFormattime[1]+"/"+xFormattime[0]+" "+xFormat[1]+":00"
  // _String = xFormattime[0]+xFormattime[1]+xFormattime[2]+xFormathour[0]+xFormathour[1]+"00"
  return _String
}