//GLOBAL VARIABLES
var mymap;
var livemarker = [];
var hmarker =[];
var livecoordsT1 = [];
var livecoordsT2 = [];
var coordsfetch = [];
var mymap;
var mymap2;
var duplacoords = [];
var breakcoords = [];
var timestamps = [];
var startpopUp = 0;
var usertruck = 1;  //DEFAULT TRUCK ----> USER SELECT WHICH ONE WANTS TO TRACK


//MAP FUNCTION (ASYNC DUE SETTIMEOUT ---> FETCH) 
async function startMap() {

//HIDE SLIDER
document.getElementById("intervalSlider").style.display = "none";	
document.getElementById("sliderLabel").style.display = "none";	

mymap = L.map('issMap').setView([10.92166,-74.80560], 13);

const attribution=  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

const tileUrl =  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
				
const tiles =  L.tileLayer(tileUrl,{attribution}).addTo(mymap);

var marker ={};

layerGroup = L.layerGroup().addTo(mymap);


//TRUCK1 ICON
const truckIcon1live = L.icon({
	iconUrl: 'truckicon.png',	
	iconAnchor: [30,30]			
})	

//TRUCK2 ICON
const truckIcon2live = L.icon({
	iconUrl: 'truck2icon.png',	
	iconAnchor: [30,30]			
})	


marker= L.marker([0,0], {icon: truckIcon1live});
marker2= L.marker([0,0], {icon: truckIcon2live});

livemarker[0]=marker;
livemarker[1]=marker2;


//CALL FUNCTIONS
await updateMarker();
};

// GET ACTUAL COORDS

async function getCoords() {
    // Petición get a una URL (FETCH)
    const response = await fetch('/actualcoords', { method: 'GET' });
    const data = await response.json();
    return data;
}

//UPDATE MAP ROUTE MARKER
async function updateMarker() {
    try {
		const _actualcoords = await getCoords();
		console.log(_actualcoords[0].latitud)
		const coordT1 = { lat: _actualcoords[0].latitud, lng: _actualcoords[0].longitud};
		const coordT2 = { lat: _actualcoords[1].latitud, lng: _actualcoords[1].longitud}
		// console.log(coord);
		livecoordsT1.push(coordT1);
		livecoordsT2.push(coordT2);

		layerGroup.clearLayers();

		//OPTIONS OF VISUALIZATION
		if (usertruck == 1){
			livemarker[0].setLatLng(coordT1).update(); //REFRESH MARKERS
			livemarker[1].setLatLng(coordT2).update();
			var polylineT1 =  L.polyline(livecoordsT1, {color: 'blue'}).addTo(layerGroup); //REFESH POLYLINES
			var polylineT2 =  L.polyline(livecoordsT2, {color: 'green', opacity: 0}).addTo(layerGroup);
			livemarker[0].addTo(layerGroup); 
			livemarker[1].addTo(layerGroup);	

			polylineT2.remove(layerGroup);
			livemarker[1].remove(layerGroup);
			// console.log("MODO SOLO CAMION 1")
		} else if (usertruck == 2){
			// console.log("MODO SOLO CAMION 2")
			livemarker[0].setLatLng(coordT1).update(); //REFRESH MARKERS
			livemarker[1].setLatLng(coordT2).update();
			 //REFESH POLYLINES
			var polylineT1 =  L.polyline(livecoordsT1, {color: 'blue', opacity: 0}).addTo(layerGroup); //REFESH POLYLINES
			var polylineT2 =  L.polyline(livecoordsT2, {color: 'green'}).addTo(layerGroup);
			livemarker[0].addTo(layerGroup); 
			livemarker[1].addTo(layerGroup);	

			polylineT1.remove(layerGroup);
			livemarker[0].remove(layerGroup);
		}else{

			livemarker[0].setLatLng(coordT1).update(); //REFRESH MARKERS
			livemarker[1].setLatLng(coordT2).update();
			var polylineT1 =  L.polyline(livecoordsT1, {color: 'blue'}).addTo(layerGroup); //REFESH POLYLINES
			var polylineT2 =  L.polyline(livecoordsT2, {color: 'green'}).addTo(layerGroup);
			livemarker[0].addTo(layerGroup); 
			livemarker[1].addTo(layerGroup);				
			// console.log("VIENDO LOS DOS CAMIONES")
		}

        refreshTable(_actualcoords);
    } catch (error) {
        console.log(error);
    }
    setTimeout(updateMarker, 5000);
}


//UPDATE HTML ITEMS (NEW COORDS)
function refreshTable(_actualcoords){

	document.getElementById("lati1").innerHTML =  _actualcoords[0].latitud;
	document.getElementById("long1").innerHTML =  _actualcoords[0].longitud;
	document.getElementById("date1").innerHTML =  _actualcoords[0].timestamp;

	document.getElementById("lati2").innerHTML =  _actualcoords[1].latitud;
	document.getElementById("long2").innerHTML =  _actualcoords[1].longitud;
	document.getElementById("date2").innerHTML =  _actualcoords[1].timestamp;


	//CENTER MAP ON THE TRUCK 
	if (usertruck == 1){
		mymap.setView(livemarker[0].getLatLng()); //Zoom working , zoom ) 
	}else if (usertruck == 2){
		mymap.setView(livemarker[1].getLatLng());
	}else{
		console.log("TIENE LIBERTAD EN EL MAPA")
	}


};

//VALIDATION INTERVAL
function _noemptySearch(){
	const IS = document.getElementById("Start").value;
	const IF = document.getElementById("Finish").value;

	hour = IS.split(" ")[1];

	if (IS == "" && IF == ""){
		alert("Ingrese fechas para realizar la búsqueda")
	}else if (IS != "" && IF == "" ){
		alert("Ingrese la fecha final de la búsqueda")
	}else if (IS > IF){
		alert("Debe seleccionar una hora mayor a: "+ hour)
	}else if(usertruck == 3){
		alert("Solo puede seleccionar un camión para realizar la búsqueda")
		_switchtoMap1();
	}else{
		getInterval();
	}
}

 //OBTENER INTERVALO DEL USUARIO 

 function getInterval(){
	 //CLEAN VALUES OF DUPLACOORDS
	startpopUp = 0;
	const intervalstart = document.getElementById("Start").value;
	const intervalend = document.getElementById("Finish").value;
	totalinterval={start: intervalstart, end: intervalend};

	_Removevalues();
	Database();
 }

async function Database(){
	
		const options = {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(
				totalinterval
			),
		}; //FETCH ATRIBUTES

		const response = await fetch(`/intervalo/${usertruck}`, options);
		const data = await response.json();
		console.log("FETCH INTERVALO EXITOSO")
		data.forEach(object => {
			coordsfetch.push({lat: object.latitud , long: object.longitud});
			timestamps.push(object.timestamp);
});

		
		//TO WRITE DUPLACOORDS CORRECTLY
		coordsfetch.forEach(object => {
			duplacoords.push([object.lat , object.long]);
		});

		_emptyInterval();

};

//HISTORICOS
function Geschichte(){ 

			if (mymap2 != undefined) { 
				mymap2.off(); 
				mymap2.remove();
			}

			if (hmarker[2] != undefined  || hmarker[3] != undefined){
				hmarker[0].remove();
				hmarker[1].remove();
				hmarker[2].remove();
				hmarker[3].remove();
			}
			
			const attribution=  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

			const tileUrl  =  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		
			mymap2 = L.map('issMap2').setView([0,0], 14);
			const tiles =  L.tileLayer(tileUrl,{attribution}).addTo(mymap2);

			//TRUCK1 ICON
			const truckIcon = L.icon({
				iconUrl: 'truckicon.png',	
				iconAnchor: [30,30]			
			})			

			//TRUCK2 ICON
			const truckIcon2 = L.icon({
				iconUrl: 'truck2icon.png',	
				iconAnchor: [30,40]			
			})				

			//START ICON
			const startIcon = L.icon({
				iconUrl: 'starticon.png',	
				iconAnchor: [32,55]			
			})	

			//FINISH ICON
			const finishIcon = L.icon({
				iconUrl: 'endicon.png',	
				iconAnchor: [25,64]			
			})
			
			hmarker[0]=  L.marker([0,0], {icon: finishIcon}).addTo(mymap2);
			hmarker[1]=  L.marker([0,0], {icon: startIcon}).addTo(mymap2);
			hmarker[2] = L.marker([0,0], {icon: truckIcon}).addTo(mymap2);
			hmarker[3] = L.marker([0,0], {icon: truckIcon2}).addTo(mymap2);
			

			// hmarker.remove();
			if (usertruck == 3){
				hmarker[0].remove();
				hmarker[1].remove();
				hmarker[2].remove();
				hmarker[3].remove();

			}else if (duplacoords[0] != null){
			
			//SHOW SLIDER
			document.getElementById("intervalSlider").style.display = "block";	
			document.getElementById("sliderLabel").style.display = "block";
			if (usertruck == 1){
				var polyline =  L.polyline(duplacoords, {color: 'blue'}).addTo(mymap2);
			}else if(usertruck == 2){
				var polyline =  L.polyline(duplacoords, {color: 'green'}).addTo(mymap2);			
			}
			var ulti= duplacoords[duplacoords.length-1]
			var first= duplacoords[0]
			var lat=ulti[0];
			var long=ulti[1];
			mymap2.panTo(new L.LatLng(lat,long));

			hmarker[0].setLatLng(ulti).bindPopup("<b>Final del recorrido.</b>").update();
			hmarker[1].setLatLng(first).bindPopup("<b>Inicio del recorrido.</b>").update();
			
			document.getElementById("intervalSlider").addEventListener("input", _sliderFilter); //SLIDER LISTENER	
			const slider = document.getElementById("intervalSlider"); //GET SLIDER ATRIBUTES
			slider.value = `${0}`; //START VALUE
			function _sliderFilter(){								
				slider.min = `${0}`; //MIN VALUE
				slider.max = `${duplacoords.length-1}`;  //MAX VALUE
			
				breakcoords = coordsfetch[slider.value]; //GET THE VALUES OF ACTUAL TARGET
				breakstamp = _timestampK(timestamps[slider.value]); 

				//TRUCK SELECTION
			if (usertruck == 1){
				hmarker[2].setLatLng(duplacoords[slider.value]);
				if (startpopUp==0){
					hmarker[2].bindPopup("Información:" + "<br/>Latitud: "+breakcoords.lat+"<br/> Longitud: "+breakcoords.long+"<br/> Fecha y Hora: "+breakstamp).togglePopup();
					startpopUp=1;
				}else{
					hmarker[2].bindPopup("Información:" + "<br/>Latitud: "+breakcoords.lat+"<br/> Longitud: "+breakcoords.long+"<br/> Fecha y Hora: "+breakstamp);
				}
				
				hmarker[2].update();				
			}else if (usertruck == 2){
				hmarker[3].setLatLng(duplacoords[slider.value]);
				if (startpopUp==0){
					hmarker[3].bindPopup("Información:" + "<br/>Latitud: "+breakcoords.lat+"<br/> Longitud: "+breakcoords.long+"<br/> Fecha y Hora: "+breakstamp).togglePopup();
					startpopUp=1;
				}else{
					hmarker[3].bindPopup("Información:" + "<br/>Latitud: "+breakcoords.lat+"<br/> Longitud: "+breakcoords.long+"<br/> Fecha y Hora: "+breakstamp);
				}
				
				hmarker[3].update();	
			}

			}

		}

		};
		
//FUNCTIONS TO SWITCH BETWEEN MAPS		
function _switchtoMap1(){
document.getElementById("issMap").style.display = "block";
document.getElementById("issMap2").style.display = "none";	

//HIDE SLIDER
document.getElementById("sliderLabel").style.display = "none";
document.getElementById("intervalSlider").style.display = "none";
_cleanInterval();
}

function _switchtoMap2(){
document.getElementById("issMap2").style.display = "block";		
document.getElementById("issMap").style.display = "none";

_cleanInterval();
}

//REFRESH POLYLINE VALUES WITH EACH REQUEST
function _Removevalues(){
		duplacoords=[];
		coordsfetch=[];
		timestamps=[];
}

//SPECIAL CASES VALIDATION

function _emptyInterval(){
	if (duplacoords[0] != null){
		_switchtoMap2();
		Geschichte();
	}else{
		alert("No existen trayectorias en este intervalo");
		_switchtoMap1();
	}
}


//TIME PICKERS FILTERED
function _picker1(){
	$("#Start").datetimepicker({
		format:'d/m/Y H:i',
		step:1
		   });
}


function _picker2(){

	$("#Finish").datetimepicker({
		format:'d/m/Y H:i',
		step:1,
		minDate:lowerLimit[0],formatDate:'d/m/Y',

		});	
}

var lowerLimit;


// ENABLE DATE2 AND INFORMATION ABOUT THE STATE
function _enableDate2(){	
	if (document.getElementById("Start").value != ""){
		document.getElementById("Finish").disabled = false;
		const intervalstart = document.getElementById("Start").value;
		lowerLimit = intervalstart.split(" ");
		_picker2();
		document.getElementById("Start").disabled = true;		
	}	
}

// SWTICH BETWEEN INTERVALS
function _cleanInterval(){
	document.getElementById("Finish").disabled = true;
	document.getElementById("Start").disabled = false;
}


// LISTENERS STATEMENT 
function listenerStatement(){
	document.getElementById("realTime").addEventListener("click", _switchtoMap1); //ENABLE MAP1
	document.getElementById("intervalbutton").addEventListener("click", _noemptySearch); //ENABLE MAP2
	document.getElementById("inputDate1").addEventListener("click", _enableDate2); //ENABLE TIMEPICKER 2

	document.getElementById("_truck1").addEventListener("change", _truck1Case); //CHECKBOX CHANGE TRUCK 1
	document.getElementById("_truck2").addEventListener("change", _truck2Case); //CHECKBOX CHANGE TRUCK 2
}


//USERTRUCK VALUES (CHECKBOX)
function _truck1Case(){
	const _truck1check = document.getElementById("_truck1");
	const _truck2check = document.getElementById("_truck2");
	if (_truck1check.checked && _truck2check.checked) {
		console.log("VISUALIZANDO AMBOS CAMIONES EN TIEMPO REAL")
		usertruck = 3;
	}else if (_truck1check.checked){
		console.log("VISUALIZANDO CAMION 1 EN TIEMPO REAL")
		usertruck =1;
	}else if  (_truck2check.checked){
		console.log("VISUALIZANDO CAMION 2 EN TIEMPO REAL")
		usertruck =2;
	}
}
function _truck2Case(){
	const _truck1check = document.getElementById("_truck1");
	const _truck2check = document.getElementById("_truck2");
	if (_truck1check.checked && _truck2check.checked) {
		console.log("VISUALIZANDO AMBOS CAMIONES EN TIEMPO REAL")
		usertruck = 3;
	}else if (_truck1check.checked){
		console.log("VISUALIZANDO CAMION 1 EN TIEMPO REAL")
		usertruck =1;
	}else if  (_truck2check.checked){
		console.log("VISUALIZANDO CAMION 2 EN TIEMPO REAL")
		usertruck =2;
	}
}

//CHECK DOM LOAD (STATEMENT ---> EventListener - getElementbyId)
document.addEventListener("DOMContentLoaded", function(event) {
	listenerStatement();
});

//TIMESTAMP CORRECTION

function _timestampK(_String){
	var xFormat = _String.split(" ");
	var xFormattime = xFormat[0].split("/")
	_String = xFormattime[2]+"/"+xFormattime[1]+"/"+xFormattime[0]+" "+xFormat[1]
	return _String
  }

// var inputdateButton = document.getElementById("inputDate1");
// inputdateButton.onclick = _disableDate2;


//function showMAPI(){

//setInterval(function() {



	

//	}, 10000);
//};

