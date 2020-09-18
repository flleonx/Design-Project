
function readFile(){


				const attribution= '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

				const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

				const tiles = L.tileLayer(tileUrl,{attribution});

				//var mymap = L.map('issMap').setView([11.01756,-74.85698], 15);

				var marca= L.marker([11.01756,-74.85698]);

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

