
var backgroundScaler = 0;
//setInterval(function(){
	backgroundScaler += 0.1;
	$('#map').css('background-color', "#000000");
	$('#map').noisy({
		intensity: 0.3,
		size: 200,
		opacity: 0.2 + 0.01 * Math.sin(backgroundScaler),
		fallback: '',
		monochrome: false,
	//	color: '#000000'
	}).css('background-color', "#000000");
//}, 500);

var grayscale = L.tileLayer.grayscale('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
	maxZoom: 14, 
	minZoom: 0
});


var dots = L.tileLayer('images/dots/{z}/{y}/{x}.png', {
	attribution: "Ryan Sawyer",
	maxZoom: 2,
	minZoom: 0//,
    	//tms: true
});


var layers = []//grayscale];


var map = L.map('map', {
	layers: layers	
});//.setView([10.97873, 4.45312], 2);


/*
var popup = L.popup();
function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
}
map.on('click', onMapClick);
*/


//var southWest = L.latLng(76.76054, -174.375),

var southWest = L.latLng(3.86004, -130.375), 
    northEast = L.latLng(41.76054, 157.53906),
    bounds = L.latLngBounds(southWest, northEast);
map.fitBounds(bounds, {maxZoom: 3});
// LatLng(-63.86004, 177.53906)





L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: 'dayrey.2d36cb40',
	accessToken: 'pk.eyJ1IjoiZGF5cmV5IiwiYSI6IjAyNzhiZDBkY2MzZTZhZWRiZjEzMTczZDI1Y2E0NDg2In0.vq5YEjO_LZwJpwbDjbp0Mg'
})



$.getJSON('countries.geo.json', function(countries){

	var shape = new L.PatternCircle({
		x: 5,
		y: 5,
		radius: 1,
	    	weight: 2,
	    	fillColor: 'rgba(204,0,204,1)',
	    	color: 'rgba(33, 100, 243, .7)',
		fill: true
	});
	var pattern = new L.Pattern({width:8, height:8});
	pattern.addShape(shape);
	pattern.addTo(map);
	var borderStyle = {
		color: 'pink',//'rgba(33, 100, 243, 1)',// '#2164f3'/*'rgba(130,130,130,1)'*/, 
		fillPattern: pattern, 
		fillColor: '#2164f3',
		fillOpacity: 1.0, 
		//opacity: 1,
		weight: 0
	};

	var borders = L.geoJson(countries, {
		style: function(feature){
				return borderStyle;
			},
		onEachFeature: function(feature, layer){
				layer.bindPopup(feature.properties.description);
			}
	}).addTo(map);

})





//map.fitWorld();
var fadeOut = function(item, time){
	if(item.options.opacity <= 0.1){
		map.removeLayer(item);
	}
	else{
		item.setStyle({opacity: item.options.opacity - .1});
		setTimeout(function(){
			fadeOut(item, time);
		}, time)
	}
}

var drawPingCircle = function(point, grow){
	var size = 350000;
	var growthCounter = 10;
	var growthRate = function(growthAmount){
		growthCounter += 0.2;
		return Math.pow(growthCounter, 4);
		return bla;
	}
	var fadeSpeed = .04;
	var circleOptions = {color:'#ff6600', weight: 3, fillOpacity: 0}
	circleOptions.opacity = grow ? 0.8 : 0.1;
	var circle = L.circle(point, grow ? 10 : size, circleOptions).addTo(map);
	var changeSize = function(){
		if(grow ? circle.options.opacity <= 0.1 : circle.options.opacity >= 1){//grow ? circle.getRadius() >= size : circle.getRadius() <= 10){
			fadeOut(circle, 80);
		}
		else{
			grow ? circleOptions.opacity -= fadeSpeed : circleOptions.opacity += fadeSpeed;
			circle.setStyle(circleOptions);
			var growthAmount = growthRate();
			var currentRad = circle.getRadius();
			circle.setRadius(grow ? currentRad + growthAmount : currentRad - growthAmount);
			setTimeout(changeSize, 30);
		}
	}
	changeSize()
}

var drawLine = function(point1, point2, lineColor){
	var lineSpeed = 5;
	var tailLength = 7;
	var framerate = 33;
	point1[0] = Number(point1[0]);
	point1[1] = Number(point1[1]);
	point2[0] = Number(point2[0]);
	point2[1] = Number(point2[1]);
	//point[0] is y and point[1] is x
	var m;
	var xDist = Math.abs(point1[1] - point2[1]);
	var yDist = Math.abs(point1[0] - point2[0]);
	var dist = Math.sqrt(xDist * xDist + yDist * yDist);
	if (point2[1] - point1[1] == 0){
		if((point2[0] - point1[0]) == 0){
			return point1[1];
		}
		m = 1000000000000;
	}else{
		m = (point2[0] - point1[0]) / (point2[1] - point1[1]);
	}
	var line = function(x){

		var y = m * (x - point2[1]) + point2[0];
		return y;
	}
	 //'#'+Math.floor(Math.random()*16777215).toString(16);
	var dashPattern = [];
	for(var i=0; i<10; i++){
		dashPattern.push(i * i); 
		dashPattern.push((9-i) * (9-i) / 3);
	}
	var lineOptions = {
		color: lineColor,
		stroke: true,
		weight: 2,
		opacity: 1,
		dashArray: dashPattern.toString()}
	var polyline = L.polyline(L.latLng(point1[0],point1[1]), L.latLng(point2[0], point2[1]), lineOptions).addTo(map);

	drawPingCircle([point1[0], point1[1]], false);
	setTimeout(function(){
		drawPingCircle([point1[0], point1[1]], false);
	}, 150);


	var circle = L.circle([point1[0], point1[1]], 1, {color: lineColor}).addTo(map);
	var originCircle = L.circle([point1[0], point1[1]], 1, {color: '#CC7A00'}).addTo(map);
	circle.setRadius(100);
	var sourceInFront = point1[1] > point2[1];
	var currentXVal = point1[1];
	var killTail = function(tailedLine){
		var removeOne = function(){
			var tailSize = tailedLine.getLatLngs().length;
			if(tailSize == 0){
				return;
			}else{
				polyline.spliceLatLngs(0, 1);
			}
			setTimeout(removeOne, framerate);
		}
		removeOne();
	}
	var getOpacity = function(x, startX, endX){
		var scaler = 1;
		-scaler * (x - startX) * (x - endX);

	}
	var incrementLine = function(){
		if(Math.abs(currentXVal - point2[1]) <= xDist / dist * lineSpeed * 2){
			polyline.addLatLng(L.latLng(point2[0], point2[1]));
			polyline.setStyle(lineOptions);
			circle.setLatLng(L.latLng(point2[0], point2[1]));
			drawPingCircle([point2[0], point2[1]], true);
			setTimeout(function(){
				drawPingCircle([point2[0], point2[1]], true);
			}, 150);
			killTail(polyline);
			setTimeout(function(){
				fadeOut(polyline, 100);
				fadeOut(circle, 100);
				fadeOut(originCircle, 100);
			}, 3000);
		}else{
			var direction = sourceInFront ? -1 : 1;
			currentXVal += xDist / dist * lineSpeed * direction;
			polyline.addLatLng(L.latLng(line(currentXVal), currentXVal));
			var numOfPoints = polyline.getLatLngs().length;
			if(numOfPoints > tailLength){
				polyline.spliceLatLngs(0, 1);
			}
			polyline.setStyle(lineOptions);
			circle.setLatLng(L.latLng(line(currentXVal), currentXVal));
			setTimeout(incrementLine, framerate);
		}
	}
	incrementLine();
}
// lat, lng = y, x
//
/* cool lines but too slow
var drawLine = function(point1, point2, lineColor){
	point1[0] = Number(point1[0]);
	point1[1] = Number(point1[1]);
	point2[0] = Number(point2[0]);
	point2[1] = Number(point2[1]);
	var lineSegments = 3;
	var drawRate = 13;
	var segmentLength = 2;
	var lines = [];
	var xDist = Math.abs(point1[1] - point2[1]);
	var yDist = Math.abs(point1[0] - point2[0]);
	var dist = Math.sqrt(xDist * xDist + yDist * yDist);
	var direction = (point1[1] > point2[1])  ? -1 : 1;

	var incAmount = xDist / dist * segmentLength * direction;

	var getLat = function(lng){
		if(point2[1] - point1[1] == 0){
			return point2[0];
		}
		var m = (point2[0] - point1[0]) / (point2[1] - point1[1]);
		var lat = m * (lng - point2[1]) + point2[0];
		return lat;
	}

	var lineOptions = {
		color: lineColor,
		stroke: true,
		weight: 2,
		opacity: 1
	//	dashArray: "5, 5, 1, 5"
	}


	var AddSegment = function(oldLng, segmentLength){
		if(Math.abs(oldLng - point2[1]) <= Math.abs(incAmount) * 2){
			var killLines = function(){
				if(lines.length != 0){
					fadeOut(lines[0], 80);
					lines.shift();
					setTimeout(killLines, 80);
				}
			}
			killLines();
		}else{
			var currentLng = oldLng + incAmount;
			if(lines.length >= lineSegments){
				fadeOut(lines[0], 5);
				lines.shift();
			}
			var startPoint = L.latLng(getLat(oldLng), oldLng);
			var endPoint = L.latLng(getLat(currentLng), currentLng);
			
			var newLine = L.polyline([startPoint, endPoint], lineOptions).addTo(map);
			
			lines.push(newLine);
			
			setTimeout(function(){
				AddSegment(currentLng, segmentLength);
			}, drawRate)
		}
	}
	AddSegment(point1[1], segmentLength);


}
*/
