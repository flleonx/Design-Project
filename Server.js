const express = require('express');
const { fstat } = require('fs');
var net =require('net');

const app = express();
const path = require('path');
var latitud ='soplao';
var longitud ='chavez';
var stamptime ='soplao';
const fs= require('fs');

app.set('port', 12000);

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

const mysql = require('mysql');

const database = mysql.createConnection({
     host: 'mydata.cfhamhnsbqmg.us-east-1.rds.amazonaws.com',
     user: 'admin',
     password: 'database01!',
     database: 'mydata'
            });

     //Verificar conexión
    database.connect((err) => {
      if(err){
          throw err;
             }
         console.log('Connected to mydata');
       });



var port = (process.argv[2] || 24000);

var server = net.createServer(function(socket){
    console.log('Truck Tracer\n');

    socket.on('data', function(data){

        
        var latitud= data.toString('utf8').split("/")[0];
        latitud=  latitud;
        var longitud= data.toString('utf8').split("/")[1];
        longitud=  longitud;
        var stamptime= data.toString('utf8').split("/")[2];
        stamptime= stamptime;

        

        datosget={latitud: latitud,longitud: longitud, fecha: stamptime, hora: 'pepe' }
        let sql = 'INSERT INTO getdata SET ?';
        let query = database.query(sql,datosget,(err,result) =>{
                  if(err) throw err;
            })

        var gpsinfo = latitud+"/"+longitud+"/"+stamptime;
        
        
        fs.writeFile('coordenadas.txt', gpsinfo, function(error){

            if(error){
                return console.log(error);
            }
            console.log("File created");
            console.log(gpsinfo);
        })
        
          
    });
    
});


server.listen(port);

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});






