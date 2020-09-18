
var express= require('express')
var app=express();
const path=require('path')
app.set('port', 10000);

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


app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});






