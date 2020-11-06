//GLOBAL VARIABLES
var mymap;
var livemarker = [];
var hmarker =[];
var livecoordsT1 = [];
var livecoordsT2 = [];
var mymap;
var mymap2;
var coordsfetchT1 = [];
var duplacoordsT1 = [];
var coordsfetchT2 = [];
var duplacoordsT2 = [];
var breakcoords = [];
var timestampsT1 = [];
var timestampsT2 = [];
var sensorT1 = [];
var sensorT2 = [];
var usertruck = 1;  //DEFAULT TRUCK ----> USER SELECT WHICH ONE WANTS TO TRACK
var usertruckH = 1; //DEFAULT TRUCK ----> USER SELECT WHICH ONE WANTS TO TRACK HISTORICS

//MAP FUNCTION (ASYNC DUE SETTIMEOUT ---> FETCH) 
async function startMap() {

//HIDE SLIDER
document.getElementById("intervalSlider").style.display = "none";	
document.getElementById("intervalSlider2").style.display = "none";
document.getElementById("sliderLabel").style.display = "none";	
document.getElementById("sliderLabel2").style.display = "none";
document.getElementById("_truck1Table").style.display = "none";	
document.getElementById("_truck2Table").style.display = "none";
document.getElementById("Table2RT").style.display = "none";

mymap = L.map('issMap', {zoomControl: false}).setView([10.92166,-74.80560], 12);

const attribution=  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

const tileUrl =  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
				
const tiles =  L.tileLayer(tileUrl,{attribution}).addTo(mymap);

//add zoom control with your options
L.control.zoom({
     position:'topright'
}).addTo(mymap);

var marker ={};

layerGroup = L.layerGroup().addTo(mymap);


//TRUCK1 ICON
const truckIcon1live = L.icon({
	iconUrl: 'truckicon.png',	
	iconAnchor: [15,15]			
})	

//TRUCK2 ICON
const truckIcon2live = L.icon({
	iconUrl: 'truck2icon.png',	
	iconAnchor: [15,15]			
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
	let S1 = _actualcoords[0].sensor;
	document.getElementById("sensor1").innerHTML =  S1+"cm";

	document.getElementById("lati2").innerHTML =  _actualcoords[1].latitud;
	document.getElementById("long2").innerHTML =  _actualcoords[1].longitud;
	document.getElementById("date2").innerHTML =  _actualcoords[1].timestamp;
	let S2= _actualcoords[1].sensor.split("/");
	document.getElementById("sensor2").innerHTML = S2[0]+"X/"+S2[1]+"Y/"+S2[2]+"Z";

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
	let IS = document.getElementById("Start").value;
	console.log(IS)
	let IF = document.getElementById("Finish").value;
	console.log(IF)
	hour = IS.split(" ")[1];
	if(IS != "" && IF != ""){
		IS = _timestampK(IS)
		IF = _timestampK(IF)
		console.log(IS+" "+ IF)
	}


	if (IS == "" && IF == ""){
		alert("Ingrese fechas para realizar la búsqueda")
	}else if (IS != "" && IF == ""){
		alert("Ingrese la fecha final de la búsqueda")
	}else if (IS > IF){
		alert("La fecha final debe ser mayor que la inicial")
	}else{
		getInterval();
	}
}

 //OBTENER INTERVALO DEL USUARIO 

 function getInterval(){
	 //CLEAN VALUES OF DUPLACOORDS
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
		const response = await fetch('/intervalo', options);
		const data = await response.json();
		console.log("FETCH INTERVALO EXITOSO")

		console.log(data)

		// TRUCK 1 COORDS AND TIMESTAMP
		data[0].forEach(object => {
			coordsfetchT1.push({lat: object.latitud , long: object.longitud});
			timestampsT1.push(object.timestamp);
		});

		//TRUCK 2 COORDS AND TIMESTAMP
		data[1].forEach(object => {
			coordsfetchT2.push({lat: object.latitud , long: object.longitud});
			timestampsT2.push(object.timestamp);		
		});

		//TO WRITE DUPLACOORDS CORRECTLY
		coordsfetchT1.forEach(object => {
			duplacoordsT1.push([object.lat , object.long]);
		});

		coordsfetchT2.forEach(object => {
			duplacoordsT2.push([object.lat , object.long]);
		});

		//SENSORS DATA
		data[0].forEach(object => {
			sensorT1.push(object.sensor);
		});

		data[1].forEach(object => {
			sensorT2.push(object.sensor);
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
		
			mymap2 = L.map('issMap2').setView([0,0], 12);
			const tiles =  L.tileLayer(tileUrl,{attribution}).addTo(mymap2);

			layerGroup2 = L.layerGroup().addTo(mymap2); //LAYERS

			//TRUCK1 ICON
			const truckIcon = L.icon({
				iconUrl: 'truckicon.png',	
				iconAnchor: [15,15]			
			})			

			//TRUCK2 ICON
			const truckIcon2 = L.icon({
				iconUrl: 'truck2icon.png',	
				iconAnchor: [15,15]			
			})				

			//START ICON
			const startIcon = L.icon({
				iconUrl: 'starticon.png',	
				iconAnchor: [16,27]			
			})	

			//FINISH ICON
			const finishIcon = L.icon({
				iconUrl: 'endicon.png',	
				iconAnchor: [16,32]			
			})

			
			hmarker[0]=  L.marker([0,0], {icon: startIcon});
			hmarker[1]=  L.marker([0,0], {icon: finishIcon});
			hmarker[2]=  L.marker([0,0], {icon: startIcon});	
			hmarker[3]=  L.marker([0,0], {icon: finishIcon});
			hmarker[4] = L.marker([0,0], {icon: truckIcon});
			hmarker[5] = L.marker([0,0], {icon: truckIcon2});

			adjustContainer2(); 
};

//HISTORICS TWO TRUCKS SIMULTANEOUSLY
function _slider(){
	layerGroup2.clearLayers();
	
	hmarker[0].addTo(layerGroup2);
	hmarker[1].addTo(layerGroup2);
	hmarker[2].addTo(layerGroup2);	
	hmarker[3].addTo(layerGroup2);
	hmarker[4].addTo(layerGroup2);
	hmarker[5].addTo(layerGroup2);

	var startpopUp=0;
	console.log("CAMION: "+usertruck)
	var Dupla = [duplacoordsT1,duplacoordsT2];
	var fetchDupla = [coordsfetchT1,coordsfetchT2];
	var timeS = [timestampsT1,timestampsT2];
	var Sensors = [sensorT1,sensorT2];
	//SHOW SLIDER
	document.getElementById("sliderContainer1").style.display = "block";
	document.getElementById("sliderContainer2").style.display = "block";	
	document.getElementById("intervalSlider").style.display = "block";
	document.getElementById("intervalSlider2").style.display = "block";		
	document.getElementById("sliderLabel").style.display = "block";
	_sliderListener();

	document.getElementById("sliderLabel").style.display = "block";
	document.getElementById("sliderLabel2").style.display = "block";

	document.getElementById("_truck1Table").style.display = "grid";	
	document.getElementById("_truck2Table").style.display = "grid";

	

	var ulti= [Dupla[0][Dupla[0].length-1],Dupla[1][Dupla[1].length-1]];
	var first= [Dupla[0][0],Dupla[1][0]];
	var lat=[ulti[0][0],ulti[1][0]];
	var long=[ulti[0][1],ulti[1][1]];
	// layerGroup2.panTo(new L.LatLng(lat,long));

	hmarker[0].setLatLng(first[0]).bindPopup("<b>Inicio del recorrido.</b>").update();
	hmarker[1].setLatLng(ulti[0]).bindPopup("<b>Final del recorrido.</b>").update();
	hmarker[2].setLatLng(first[1]).bindPopup("<b>Inicio del recorrido.</b>").update();
	hmarker[3].setLatLng(ulti[1]).bindPopup("<b>Final del recorrido.</b>").update();


	document.getElementById("intervalSlider").addEventListener("input", _sliderFilter); //SLIDER LISTENER
	document.getElementById("intervalSlider2").addEventListener("input", _sliderFilter2); //SLIDER LISTENER
	
	const slider = document.getElementById("intervalSlider"); //GET SLIDER ATRIBUTES
	const slider2 = document.getElementById("intervalSlider2"); //GET SLIDER2 ATRIBUTES

	document.getElementById("intervalSlider").style.background = "linear-gradient(90deg, rgb(46, 77, 189)"+ (x2/max1)*100 +"%, rgb(214,214,214)"+ (x1/max1)*100+"%)"
	document.getElementById("intervalSlider2").style.background = "linear-gradient(90deg, rgb(46, 77, 189)"+ (x2/max2)*100 +"%, rgb(214,214,214)"+ (x2/max2)*100+"%)"

	slider.value = `${x1}`; //START VALUE
	console.log("CAMION: "+usertruck)			
	slider.min = `${0}`; //MIN VALUE
	slider.max = `${Dupla[0].length-1}`;  //MAX VALUE

	slider2.value = `${x2}`; //START VALUE
	console.log("CAMION: "+usertruck)			
	slider2.min = `${0}`; //MIN VALUE
	slider2.max = `${Dupla[1].length-1}`;  //MAX VALUE

	function _sliderFilter(){		
		hmarker[4].setLatLng(Dupla[0][slider.value]);
		document.getElementById("lati1H").innerHTML =  fetchDupla[0][slider.value].lat;
		document.getElementById("long1H").innerHTML =  fetchDupla[0][slider.value].long;
		document.getElementById("date1H").innerHTML =  timeS[0][slider.value];
		let S1D = Sensors[0][slider.value];
		document.getElementById("sensor1H").innerHTML =  S1D+"cm";
		hmarker[4].update();				
	}

	function _sliderFilter2(){		
		hmarker[5].setLatLng(Dupla[1][slider2.value]);
		document.getElementById("lati2H").innerHTML =  fetchDupla[1][slider2.value].lat;
		document.getElementById("long2H").innerHTML =  fetchDupla[1][slider2.value].long;
		document.getElementById("date2H").innerHTML =  timeS[1][slider2.value];
		let S2D = Sensors[1][slider2.value].split("/");
		document.getElementById("sensor2H").innerHTML =  S2D[0]+"X/"+S2D[1]+"Y/"+S2D[2]+"Z";
		hmarker[5].update();				
	}

	if (usertruckH == 1){
		hmarker[2].remove(layerGroup2);
		hmarker[3].remove(layerGroup2);
		hmarker[5].remove(layerGroup2);
		document.getElementById("sliderLabel2").style.display = "none";
		document.getElementById("sliderContainer2").style.display = "none";
		document.getElementById("_truck2Table").style.display = "none";	
		var polylineT1 =  L.polyline(duplacoordsT1, {color: 'blue'}).addTo(layerGroup2);
		var polylineT2 =  L.polyline(duplacoordsT2, {color: 'green'}).addTo(layerGroup2);	
		polylineT2.remove(layerGroup2);
		mymap2.setView(hmarker[1].getLatLng()); 
	} else if (usertruckH ==2){
		hmarker[0].remove(layerGroup2);
		hmarker[1].remove(layerGroup2);
		hmarker[4].remove(layerGroup2);			
		var polylineT1 =  L.polyline(duplacoordsT1, {color: 'blue'}).addTo(layerGroup2);
		var polylineT2 =  L.polyline(duplacoordsT2, {color: 'green'}).addTo(layerGroup2);	
		document.getElementById("sliderLabel").style.display = "none";
		document.getElementById("sliderContainer1").style.display = "none";
		document.getElementById("_truck1Table").style.display = "none";	
		polylineT1.remove(layerGroup2);	
		mymap2.setView(hmarker[3].getLatLng()); 
	}  else if (usertruckH == 3){
		var polylineT1 =  L.polyline(duplacoordsT1, {color: 'blue'}).addTo(layerGroup2);
		var polylineT2 =  L.polyline(duplacoordsT2, {color: 'green'}).addTo(layerGroup2);
		mymap2.setView(hmarker[1].getLatLng()); 	
	} else if(usertruckH == 0){
		clearALL();
	}
}
		
//FUNCTIONS TO SWITCH BETWEEN MAPS		
function _switchtoMap1(){
document.getElementById("issMap").style.display = "block";
document.getElementById("issMap2").style.display = "none";	

// HIDE SLIDER
// document.getElementById("sliderLabel").style.display = "none";
// document.getElementById("intervalSlider").style.display = "none";

// _cleanInterval();
}

function _switchtoMap2(){
document.getElementById("issMap2").style.display = "block";		
document.getElementById("issMap").style.display = "none";

// _cleanInterval();
}

//REFRESH POLYLINE VALUES WITH EACH REQUEST
function _Removevalues(){
		duplacoordsT1=[];
		coordsfetchT1=[];
		timestampsT1=[];
		duplacoordsT2=[];
		coordsfetchT2=[];
		timestampsT2=[];

		let cleanStart = document.getElementById("Start");
		let cleanFinish = document.getElementById("Finish");
		
		cleanStart.value = ""
		cleanFinish.value = ""
}

//SPECIAL CASES VALIDATION
function _emptyInterval(){

	x1=0;
	x2=0;

	if(usertruckH == 3){
		if (duplacoordsT1.length !=0 || duplacoordsT1.length != 0){
		_switchtoMap2();
		Geschichte();
		}else{
			alert("No existen trayectorias en este intervalo para ningún camión");
			adjustContainer2();
		}
	}else if(usertruckH == 1){
		if (duplacoordsT1.length != 0){
			_switchtoMap2();
			Geschichte();
		}else{
			alert("No existen trayectorias en este intervalo para el camión 1");
			adjustContainer2();
		}

	} else if(usertruckH == 2){
		if (duplacoordsT2.length != 0){
			_switchtoMap2();
			Geschichte();
		}else{
			alert("No existen trayectorias en este intervalo para el camión 2");
			adjustContainer2();
		}
	}else if(usertruckH == 0 && (duplacoordsT1.length !=0 || duplacoordsT1.length != 0)){
		alert("Busqueda realizada con éxito, seleccione alguno de los 2 camiones para visualizar su trayecto")
		_switchtoMap2();
		Geschichte();
	}else if (usertruckH == 0 && (duplacoordsT1.length ==0 || duplacoordsT1.length == 0)){
		alert("No existen trayectorias en este intervalo para ningún camión");
		adjustContainer2();
	}
}

//TIME PICKERS FILTERED
function _picker1(){
	$("#Start").datetimepicker({
		defaultTime: '00:00',
		format:'d/m/Y H:i',
		step:15,
		onClose: function(){
			let lowerLimit = document.getElementById("Start").value.split(" ");
			_picker2(lowerLimit);
		}
		   });

}

function _picker2(lowerLimit){
	let cleanSelection = document.getElementById("Finish");
	cleanSelection.value = ""

	$("#Finish").datetimepicker({
		format:'d/m/Y H:i',
		defaultDate: lowerLimit[0],
		defaultTime: '00:00',
		step:15,
		minDate:lowerLimit[0],formatDate:'d/m/Y',
		});	
}

// LISTENERS STATEMENT 
function listenerStatement(){
	// document.getElementById("realTime").addEventListener("click", _switchtoMap1); //ENABLE MAP1
	document.getElementById("intervalbutton").addEventListener("click", _noemptySearch); //ENABLE MAP2
	// document.getElementById("inputDate1").addEventListener("click", _enableDate2); //ENABLE TIMEPICKER 2

	document.getElementById("_truck1RT").addEventListener("change", _truck1Case); //CHECKBOX CHANGE TRUCK 1 REAL TIME
	document.getElementById("_truck2RT").addEventListener("change", _truck2Case); //CHECKBOX CHANGE TRUCK 2 REAL TIME

	document.getElementById("_truck1H").addEventListener("change", _polylineT1H); //CHECKBOX CHANGE TRUCK 1 HISTORICS
	document.getElementById("_truck2H").addEventListener("change", _polylineT2H); //CHECKBOX CHANGE TRUCK 2	HISTROICS

	document.getElementById("_realTM").addEventListener("change", _hidehistoricM); //HIDE HISTORIC MODE
	document.getElementById("_historicM").addEventListener("change", _hiderealTM); //HIDE REAL TIME MODE
}


//USERTRUCK VALUES (CHECKBOX)
function _truck1Case(){
	const _truck1check = document.getElementById("_truck1RT");
	const _truck2check = document.getElementById("_truck2RT");
	if (_truck1check.checked && _truck2check.checked) {
		usertruck = 3;
	}else if (_truck1check.checked){
		usertruck =1;
	}else if  (_truck2check.checked){
		usertruck =2;
	}else if (!_truck1check.checked && !_truck2check.checked){
		_truck2check.checked = true;
		usertruck =2;
	}
	adjustContainer1();
}
function _truck2Case(){
	const _truck1check = document.getElementById("_truck1RT");
	const _truck2check = document.getElementById("_truck2RT");
	if (_truck1check.checked && _truck2check.checked) {
		usertruck = 3;
	}else if (_truck1check.checked){
		usertruck =1;
	}else if  (_truck2check.checked){
		usertruck =2;
	}else if (!_truck1check.checked && !_truck2check.checked){
		_truck1check.checked = true;
		usertruck =1;
	}
	adjustContainer1();
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



let _hiderealTM = () =>{
	console.log("CAMBIO A HISTORICOS")
	const _realTimecheck = document.getElementById("_realTM");
	const _historicModecheck = document.getElementById("_historicM");
	if (_historicModecheck.checked){
		document.getElementById("sub-container1").style.display = "none";
		document.getElementById("sub-container2").style.display = "grid";
		_realTimecheck.checked = false;

		if (duplacoordsT1[0] != undefined || duplacoordsT2[0] != undefined){
			console.log("Entre")
			_switchtoMap2();
		} 
	}else if(!_historicModecheck.checked && !_realTimecheck.checked){
		document.getElementById("sub-container1").style.display = "grid";
		document.getElementById("sub-container2").style.display = "none";
		_realTimecheck.checked = true;
		_switchtoMap1();
	}
} 

let _hidehistoricM = () =>{
	console.log("CAMBIO A REAL TIME")
	const _realTimecheck = document.getElementById("_realTM");
	const _historicModecheck = document.getElementById("_historicM");
	if (_realTimecheck.checked){
		document.getElementById("sub-container2").style.display = "none";
		document.getElementById("sub-container1").style.display = "grid";
		_switchtoMap1();
		_historicModecheck.checked = false;
	}else if(!_realTimecheck.checked && !_historicModecheck.checked){
		document.getElementById("sub-container1").style.display = "none";
		document.getElementById("sub-container2").style.display = "grid";
		_historicModecheck.checked = true;
		if (duplacoordsT1[0] != undefined || duplacoordsT2[0] != undefined){
			console.log("Entre")
			_switchtoMap2();
		} 
	}
} 

let adjustContainer1 = () =>{

	const _truck1check = document.getElementById("_truck1RT");
	const _truck2check = document.getElementById("_truck2RT");
	const _T1 = document.getElementById("Table1RT");
	const _T2 = document.getElementById("Table2RT");
	let Container1 = document.getElementById("sub-container1")
	// Case_Empty();
	Other();

	function Other(){
		if (_truck1check.checked && _truck2check.checked) {
			Container1.style.height =300+"px";
			_T1.style.display = "grid"
			_T2.style.display = "grid"
		}else if (_truck1check.checked ){
			Container1.style.height = 175+"px";
			_T1.style.display = "grid"
			_T2.style.display = "none"
		}else if  (_truck2check.checked){
			Container1.style.height = 175+"px";
			_T1.style.display = "none"
			_T2.style.display = "grid"
		}else if (!_truck1check.checked && !_truck2check.checked){
			Container1.style.height = 53+"px";
			_T1.style.display = "none"
			_T2.style.display = "none"
		}
	}

}

let adjustContainer2 = () =>{

	const _truck1check = document.getElementById("_truck1H");
	const _truck2check = document.getElementById("_truck2H");
	let Container2 = document.getElementById("sub-container2")
	Case_Empty();

	function Other(){
		if (_truck1check.checked && _truck2check.checked) {
			Container2.style.height = 553+"px";
			_slider();
		}else if (_truck1check.checked && coordsfetchT1.length !=0 && coordsfetchT1.length !=undefined){
			Container2.style.height = 385+"px";
			_slider();
		}else if  (_truck2check.checked && coordsfetchT2.length !=0 && coordsfetchT2.length !=undefined){
			Container2.style.height = 385+"px";
			_slider();
		}else if (!_truck1check.checked && !_truck2check.checked){
			Container2.style.height = 223+"px";
			_slider();
		}
	}
	function Case_Empty(){
		if (((coordsfetchT1.length ==0 && coordsfetchT2.length ==0) || (coordsfetchT1.length ==undefined && coordsfetchT2.length ==undefined))){
			Container2.style.height = 223+"px";
			clearALL();
		}else{
			Other();
		}
	}
}

let _polylineT1H = () =>{
	const _truck1check = document.getElementById("_truck1H");
	const _truck2check = document.getElementById("_truck2H");
	let Container2 = document.getElementById("sub-container2");

	if (_truck1check.checked && _truck2check.checked) {
		usertruckH = 3;

	}else if (_truck1check.checked){
		usertruckH =1;

	}else if  (_truck2check.checked){
		usertruckH =2;

	}else if (!_truck1check.checked && !_truck2check.checked){
		usertruckH =0;
	}
	adjustContainer2();

}

let _polylineT2H = () =>{
	const _truck1check = document.getElementById("_truck1H");
	const _truck2check = document.getElementById("_truck2H");

	let Container2 = document.getElementById("sub-container2")
	if (_truck1check.checked && _truck2check.checked) {
		usertruckH = 3;

	}else if (_truck1check.checked){
		usertruckH =1;

	}else if  (_truck2check.checked){
		usertruckH =2;

	}else if (!_truck1check.checked && !_truck2check.checked){
		usertruckH =0;

	}
	adjustContainer2();
}
//SLIDER PERSONALIZATION

var x1 = 0;
var x2 = 0;
var max1 = 0;
var max2 = 0;

function _sliderListener(){
var slider1X = document.getElementById("intervalSlider")
var slider2X = document.getElementById("intervalSlider2")

slider1X.addEventListener("mousemove", function(){
	max1 = slider1X.max
	x1 = slider1X.value;
	var color1 = "linear-gradient(90deg, rgb(46, 77, 189)"+ (x1/max1)*100 +"%, rgb(214,214,214)"+ (x1/max1)*100+"%)";
	slider1X.style.background = color1;
})

slider2X.addEventListener("mousemove", function(){
	max2 = slider2X.max
	x2 = slider2X.value;
	var color2 = "linear-gradient(90deg, rgb(46, 77, 189)"+ (x2/max2)*100 +"%, rgb(214,214,214)"+ (x2/max2)*100+"%)";
	slider2X.style.background = color2;
})
}

function clearALL(){
	layerGroup2.clearLayers();
	document.getElementById("sliderLabel").style.display = "none";
	document.getElementById("sliderLabel2").style.display = "none";
	document.getElementById("sliderContainer1").style.display = "none";
	document.getElementById("sliderContainer2").style.display = "none";
	document.getElementById("_truck1Table").style.display = "none";	
	document.getElementById("_truck2Table").style.display = "none";

	document.getElementById("lati1H").innerHTML =  "";
	document.getElementById("long1H").innerHTML =  "";
	document.getElementById("date1H").innerHTML =  "";
	document.getElementById("sensor1H").innerHTML = "";
	document.getElementById("lati2H").innerHTML =  "";
	document.getElementById("long2H").innerHTML =  "";
	document.getElementById("date2H").innerHTML =  "";
	document.getElementById("sensor2H").innerHTML = "";

	document.getElementById("intervalSlider").style.background = "linear-gradient(90deg, rgb(46, 77, 189)"+0+"%, rgb(214,214,214)"+0+"%)";
	document.getElementById("intervalSlider2").style.background = "linear-gradient(90deg, rgb(46, 77, 189)"+0+"%, rgb(214,214,214)"+0+"%)";
}


