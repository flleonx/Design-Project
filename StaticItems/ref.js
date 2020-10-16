//GLOBAL VARIABLES
var mymap;
var livemarker = [];
var hmarker =[];
var livecoords = [];
var duplacoords = [];
var mymap;
var mymap2;


//MAP FUNCTION (ASYNC DUE SETTIMEOUT ---> FETCH) 
async function startMap() {

mymap = L.map('issMap').setView([10.92166,-74.80560], 17);

const attribution=  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

const tileUrl =  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
				
const tiles =  L.tileLayer(tileUrl,{attribution}).addTo(mymap);

var marker ={};

marker= L.marker([10.92166,-74.80560]);

livemarker[0]=marker;

livemarker[0].addTo(mymap);



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
		const coord = { lat: _actualcoords.latitud, lng: _actualcoords.longitud};
		// console.log(coord);
		livemarker[0].setLatLng(coord).update();
		livecoords.push(coord);
		var polyline =  L.polyline(livecoords, {color: 'blue'}).addTo(mymap);

        refreshTable(_actualcoords);
    } catch (error) {
        console.log(error);
    }
    setTimeout(updateMarker, 5000);
}


//UPDATE HTML ITEMS (NEW COORDS)
function refreshTable(_actualcoords){

	document.getElementById("lati").innerHTML =  _actualcoords.latitud;
	document.getElementById("long").innerHTML =  _actualcoords.longitud;
	document.getElementById("date").innerHTML =  _actualcoords.timestamp;

	mymap.setView(livemarker[0].getLatLng(), 16);
};

//AVOID DOM CHECK ERRORS (GUIDE)

// var DOMcheck = false;

// document.addEventListener("DOMContentLoaded", function(event) {
// 	DOMchek = true;
//   });


// if(DOMcheck){
// document.getElementById("intervalbutton").addEventListener("click", function() {

// 	console.log("Nice");
//   });
// }

document.addEventListener("DOMContentLoaded", function(event) {
	var totalinterval={start: 'intervalstart', end: 'intervalend'};
	const intervalstart = document.getElementById("Start").value;
	const intervalend = document.getElementById("Finish").value;
  });



 //OBTENER INTERVALO DEL USUARIO 

 function getInterval(){
	const intervalstart = document.getElementById("Start").value;
	const intervalend = document.getElementById("Finish").value;

	totalinterval={start: intervalstart, end: intervalend};

	Database();
 }

async function Database(){
	
console.log(typeof totalinterval + typeof totalinterval.start + typeof totalinterval.end)
	console.log(totalinterval)

		const options = {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(
				totalinterval
			),
		};
		console.log(options.body)

		const response = await fetch('/intervalo', options);
		const data = await response.json();
		console.log("FETCH EXITOSO")
		data.forEach(object => {
			duplacoords.push([object.latitud, object.longitud]);
		});

		_emptyInterval();

};

//HISTORICOS
function Geschichte(){ 

			if (mymap2 != undefined) { 
				mymap2.off(); 
				mymap2.remove();
			}
			
			const attribution=  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

			const tileUrl  =  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		
			mymap2 = L.map('issMap2').setView([10.92166,-74.80560], 17);
			const tiles =  L.tileLayer(tileUrl,{attribution}).addTo(mymap2);

			hmarker[0]=  L.marker([10.92166,-74.80560]).addTo(mymap2);
			hmarker[1]=  L.marker([10.92166,-74.80560]).addTo(mymap2);
			// hmarker.remove();

			console.log(duplacoords)
			if (duplacoords[0] != null){
			var polyline =  L.polyline(duplacoords, {color: 'red'}).addTo(mymap2);
			var ulti= duplacoords[duplacoords.length-1]
			var first= duplacoords[0]
			console.log(ulti)
			var lat=ulti[0];
			var long=ulti[1];
			mymap2.panTo(new L.LatLng(lat,long));

			hmarker[0].setLatLng(ulti).update();
			hmarker[1].setLatLng(first).update();
			_Removevalues();
			}
		};
		
//FUNCTIONS TO SWITCH BETWEEN MAPS		
function _switchtoMap1(){
document.getElementById("issMap").style.display = "block";
document.getElementById("issMap2").style.display = "none";	
}

function _switchtoMap2(){
document.getElementById("issMap2").style.display = "block";		
document.getElementById("issMap").style.display = "none";

getInterval();
_cleanInterval();
}

//REFRESH POLYLINE VALUES WITH EACH REQUEST
function _Removevalues(){
		duplacoords=[];
}

//SPECIAL CASES VALIDATION

function _emptyInterval(){
	if (duplacoords[0] != null){
		Geschichte();
		document.getElementById("Cases").innerHTML = "Busqueda exitosa"
	}else{
		document.getElementById("Cases").innerHTML = "No existen trayectorias en este intervalo";
		Geschichte();
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
		minTime:lowerLimit[1],formatTime:'H:i'
		});	
}



var lowerLimit;
// document.getElementById("inputDate1").addEventListener("click", _disableDate2, false);


// ENABLE DATE2 AND INFORMATION ABOUT THE STATE
function _enableDate2(){	
	if (document.getElementById("Start").value != ""){
		document.getElementById("Cases").innerHTML = "Fecha de inicio ingresada correctamente, ingrese la fecha final y pulse en 'Ingresar Invervalo'";
		document.getElementById("Finish").disabled = false;
		const intervalstart = document.getElementById("Start").value;
		lowerLimit = intervalstart.split(" ");
		_picker2();
		document.getElementById("Start").disabled = true;		
	}else{
		document.getElementById("Cases").innerHTML = "Debe ingresar el primer intervalo correctamente";
	}
	
}

// SWTICH BETWEEN INTERVALS
function _cleanInterval(){
	document.getElementById("Finish").disabled = true;
	document.getElementById("Start").disabled = false;
}



// var inputdateButton = document.getElementById("inputDate1");
// inputdateButton.onclick = _disableDate2;


//function showMAPI(){

//setInterval(function() {



	

//	}, 10000);
//};

