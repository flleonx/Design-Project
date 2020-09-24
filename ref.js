
function readFile(){

				const attribution= '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

				const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

				

				var mymap = L.map('issMap').setView([11.01756,-74.85698], 15);
				const tiles = L.tileLayer(tileUrl,{attribution}).addTo(mymap);

				var marca ={};

				marca= L.marker([11.01756,-74.85698]).addTo(mymap);

				var Coords=[];

				
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



				mymap.panTo(new L.LatLng(lati, long));
				//CARTOGRAFIA
				//var mymap = L.map('issMap').setView([lati, long], 15);

				marca.setLatLng([lati,long]).update();

				
				var coordinates = [lati,long];
				Coords.push(coordinates);
				drawLine(Coords);


				})
      		}, 1000);

      		function drawLine(Coords){
      			var polyline = L.polyline(Coords, {color: 'green'}).addTo(mymap);
      		}
      	};

//function showMAPI(){

//setInterval(function() {



	

//	}, 10000);
//};

