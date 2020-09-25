const express = require('express');
const { fstat } = require('fs');
var net =require('net');

const app = express();
const path = require('path');
var latitud ='x1';
var longitud ='x2';
var stamptime ='x3';
const fs= require('fs');

app.set('port', 51000);

//ENVIAR ARCHIVOS AL REQUEST
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'))
	console.log('Se recibio una petición de tipo get')
}) 

app.get('/Coordenadas.txt',function(req,res){
	res.sendFile(__dirname + '/Coordenadas.txt')
})


app.get('/Style.css',function(req,res){
	res.sendFile(__dirname + '/Style.css')
})

app.get('/normalize.css',function(req,res){
	res.sendFile(__dirname + '/normalize.css')
})

app.get('/ref.js',function(req,res){
	res.sendFile(__dirname + '/ref.js')
})

app.get('/map.js',function(req,res){
	res.sendFile(__dirname + '/map.js')
})

// const mysql = require('mysql');

// const database = mysql.createConnection({
//      host: 'mydata.cfhamhnsbqmg.us-east-1.rds.amazonaws.com',
//      user: 'admin',
//      password: 'database01!',
//      database: 'mydata'
//             });

//      //Verificar conexión
//     database.connect((err) => {
//       if(err){
//           throw err;
//              }
//          console.log('Connected to mydata');
//        });

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

var gpsinfo=''

server.on('message', function(msg, rinfo) {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

        var latitud= msg.toString('utf8').split(";")[0]; 
        latitud=  latitud;
        var longitud= msg.toString('utf8').split(";")[1];
        longitud=  longitud;
        var fecha= msg.toString('utf8').split(";")[2];
        fecha= fecha;
        var hora= msg.toString('utf8').split(";")[3];
        hora= hora;

        

        datosget={latitud: latitud,longitud: longitud, fecha: fecha, hora: hora }
        let sql = 'INSERT INTO getdata SET ?';
        let query = database.query(sql,datosget,(err,result) =>{
                  if(err) throw err;
            })

        gpsinfo = latitud+";"+longitud+";"+fecha+";"+hora;

		 fs.appendFile('Coordenadas.txt',gpsinfo, {flag: "w"}, (error) => {
			if(error){
				throw error;
			}
				//console.log('Coordenadas escritas en txt')
			});       
});

//Escribir TXT desde nodejs


// 
server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});



        
server.bind(52000);
        

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});









