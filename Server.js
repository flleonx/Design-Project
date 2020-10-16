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

// var output = read('Credenciales.txt', function(data) {
    // const credenciales=data;
    // hostvalue= credenciales.split(";")[0];
    // uservalue= credenciales.split(";")[1];
    // passwordvalue= credenciales.split(";")[2];
    // databasevalue= credenciales.split(";")[3]; 
    // hostvaluef.push(hostvalue)
// });

const mysql = require('mysql');

const database = mysql.createConnection({
     host: hostvalue,
     user: uservalue,
     password: passwordvalue,
     database: databasevalue
            });

     //Verificar conexión
    database.connect((err) => {
      if(err){
          // throw err;
             }
         console.log('Connected to mydata');
       });

const dgram = require('dgram');
const server1 = dgram.createSocket('udp4');

server1.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server1.close();
});

var gpsinfo=''

server1.on('message', function(msg, rinfo) {
  // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

        var latitud= msg.toString('utf8').split(";")[0]; 
        latitud=  latitud;
        var longitud= msg.toString('utf8').split(";")[1];
        longitud=  longitud;
        var timestamp= msg.toString('utf8').split(";")[2];
        timestamp= timestamp;
        
        datosget={latitud: latitud,longitud: longitud, timestamp: timestamp }
        let sql = 'INSERT INTO getdata SET ?';
        let query = database.query(sql,datosget,(err,result) =>{
                  if(err) throw err;
            })

        gpsinfo = latitud+";"+longitud+";"+timestamp;

		//  fs.appendFile(path.join(__dirname + '/StaticItems/Coordenadas.txt'),gpsinfo, {flag: "w"}, (error) => {
		// 	if(error){
		// 		throw error;
		// 	}
		// 		//console.log('Coordenadas escritas en txt')
		// 	});       
});





server1.on('listening', () => {
  const address = server1.address();
  console.log(`UDP Socket Listening at: ${address.address}:${address.port}`);
});


// Llamar POST

app.get('/', (request, response) => {
  response.writeHead(200, {'content-type': 'text/html'});
  var file = fs.createReadStream('index.html');
  file.pipe(response);
});


app.get('/actualcoords', function(req, res) {
  let sql = 'SELECT * FROM getdata WHERE Entrada = (SELECT MAX(Entrada)  FROM getdata)'
  let query = database.query(sql, (err, output) => {
      if (err) throw err;
      // console.log(output)
      res.end(JSON.stringify(output[0]));
  });
});


app.post('/intervalo', function (req,res) {
  console.log(req.body.start)
  console.log(req.body.end)
  
  var Start = req.body.start;
  var Finish = req.body.end;

  Start = Start.toString()
  Finish = Finish.toString()
   
  console.log(Start)
  console.log(Finish)

  let sql = `SELECT latitud, longitud FROM getdata WHERE timestamp BETWEEN '${Start}' and '${Finish}'`;//CAMBIAR TIMESTAMP POR COLUMNA CORRECTA
    let query = database.query(sql, (err, output) => {
        if(err){ throw err;}
        //  console.log(output);
      res.end(JSON.stringify(output))
});

});


server1.bind(52000);
// server.listen(51000, () => {
//   console.log("Servidor en puerto 51000");
// });