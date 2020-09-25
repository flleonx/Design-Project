
function readFile(){

				const attribution= '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

				const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

				

				var mymap = L.map('issMap').setView([10.92166,-74.80560], 17);
				const tiles = L.tileLayer(tileUrl,{attribution}).addTo(mymap);

				var marca ={};

				marca= L.marker([10.92166,-74.80560]).addTo(mymap);

				var Coords=[];

				var i=0;

       		setInterval(function() {
       			if (i!=0){
       				var coordinates = [lati,long];
       			}
				

           	 	jQuery.get('Coordenadas.txt', function(txt){
           	 	lati= txt.toString('utf8').split(";")[0];
				$("#lati").text(lati);
           	 	long= txt.toString('utf8').split(";")[1];
				$("#long").text(long);
           	 	date= txt.toString('utf8').split(";")[2];
				$("#date").text(date);
           	 	hour= txt.toString('utf8').split(";")[3];
				$("#hour").text(hour);

				var actual = [lati,long];
				//CENTRAR MAPA
				mymap.panTo(new L.LatLng(lati, long));
				//CARTOGRAFIA
				//var mymap = L.map('issMap').setView([lati, long], 15);

				//ACTUALIZAR MARKER
				marca.setLatLng([lati,long]).update();

				//EVITAR SUPERPOSICIÓN
				if (i!=0){
				
				if (coordinates[0]!=actual[0] && coordinates[1]!=actual[1]  ) {
                Coords.push(actual)
                drawLine(Coords); 
                
                	}
            	}

				i=i+1;

				})
      		}, 1000);

      		function drawLine(Coords){
      			var polyline = L.polyline(Coords, {color: 'red'}).addTo(mymap);
      		}
      	};

//function showMAPI(){

//setInterval(function() {



	

//	}, 10000);
//};

