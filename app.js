var host = "ws://somehost:8887";

var myApp = angular.module('attackerApp',[]);

var attackOriginCountries = {};
var attackDestinations = {};

myApp.factory('websocketService', function(){
	return {
			start: function(host, callback){
				var wsserver = new MockServer(host);
				var ws = new MockSocket(host);

				startMockData(wsserver);

				ws.onopen = function(){
					console.log("WS connection established");
					console.log(host)
				}
				ws.onmessage = function(message){
					var data = JSON.parse(message.data);
					if(attackOriginCountries[data.attackerCountry]){
						attackOriginCountries[data.attackerCountry] += 1;
					}else{
						attackOriginCountries[data.attackerCountry] = 1;
					}
					if(attackDestinations[data.hostHeader]){
						attackDestinations[data.hostHeader] += 1;
					}else{
						attackDestinations[data.hostHeader] = 1;
					}
					callback(data);
					var startLoc = [data.attackerLatitude, data.attackerLongitude];
					var endLoc = [data.targetLatitude, data.targetLongitude];
					var color = 'rgba(255, 102, 0, .75)';//'rgba(255, 255, 0, .75)';
					drawLine(startLoc, endLoc, color);
				}
			}
		}


})

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

myApp.controller('tableController', ['$scope', 'websocketService', function($scope, websocketService) {
	$scope.attacks = [];
	$scope.getKeys = function(obj){
		return Object.keys(obj);
	}
	var maxAttackers = 7;



	$scope.getAttackRowStyle = function(attack){
		var returnColor = (attack.severity === "Informational") ? "#A8F000" : (attack.severity === "Notice" ? "#FFFF00" : (attack.severity === "Warning" ? "#FFB300" : (attack.severity === "Error" ? "#FF7400" : (attack.severity === "Critical" ? "#FF1800" : "#C9007A"))));
		return {"background-color" : convertHex(returnColor, 15)}
	}

	var updateAttackers = function(attack){
		if($scope.attacks.length > maxAttackers){
			$scope.attacks = $scope.attacks.slice(1, $scope.attacks.length);
		}
		$scope.topDestinations = [];
		$scope.topSourceCountries = [];
		for(key in attackDestinations){
			var obj = {};
			obj[key] = attackDestinations[key];
			$scope.topDestinations.push(obj);
		}
		for(key in attackOriginCountries){
			var obj = {};
			obj[key] = attackOriginCountries[key];
			$scope.topSourceCountries.push(obj);
		}
		$scope.topDestinations = $scope.topDestinations.sort(function(a, b){return -a[Object.keys(a)[0]] + b[Object.keys(b)[0]]}).slice(0,5);
		$scope.topSourceCountries = $scope.topSourceCountries.sort(function(a, b){return -a[Object.keys(a)[0]] + b[Object.keys(b)[0]]}).slice(0,5);
		$scope.attacks.push(attack);
		$scope.$apply();
	}
	websocketService.start(host,updateAttackers);
}]);


