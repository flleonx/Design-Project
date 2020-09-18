
function readFile(){


				const attribution= '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

				const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

				const tiles = L.tileLayer(tileUrl,{attribution});

				//var mymap = L.map('issMap').setView([11.01756,-74.85698], 15);

				var marca= L.marker([11.01756,-74.85698]);

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
				
				

       		setInterval(function() {

           	 	jQuery.get('Coordenadas.txt', function(txt){
           	 	lati= txt.toString('utf8').split(";")[0];
				$("#lati").text(lati);
           	 	long= txt.toString('utf8').split(";")[1];
				$("#long").text(long);
           	 	date= txt.toString('utf8').split(";")[2];
				$("#date").text(date);
           	 	hour= txt.toString('utf8').split(";")[3];
				$("#hour").text(hour);


				datosget={latitud: lati,longitud: long,fecha: date, hora: hour}
				let sql = 'INSERT INTO getdata SET ?';
				let query = database.query(sql,datosget,(err,result) =>{
					if(err) throw err;
				});

				//CARTOGRAFIA
				var mymap = L.map('issMap').setView([lati, long], 15);

				marca= L.marker([lati,long]);

				marca.addTo(mymap);
				tiles.addTo(mymap);
				})
      		}, 1000);
   		};

//function showMAPI(){

//setInterval(function() {



	

//	}, 10000);
//};

