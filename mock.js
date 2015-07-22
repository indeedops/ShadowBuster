var signatures = ["Denial of Service", "Suspicious User Agent", "Attempted SQL Injection", "Attempted XSS", "Attempted LDAP Injection", "Many Failed SSH Logins", "Zone Transfer Attempt"]

var hostHeaders = ["secure.example.com", "api.example.com", "www.example.com", "my.example.com", "blog.example.com", "mail.example.com"]

var startMockData = function(socket){
	console.log(socket);
	socket.on('connection', function(ws) {
		var done = false;
		console.log('connection');
		ws.on('error', function(){done = true;});
		ws.on('close', function(){done = true;});
		var repeat = function(){
			var attackerCountry = chance.country();
			while(!(attackerCountry in countries)){
				var attackerCountry = chance.country();
			}
			var targetCountry = chance.country();
			while(!(targetCountry in countries)){
				var targetCountry = chance.country();
			}
			var signature = signatures[Math.floor(Math.random()*signatures.length)];
			var hostHeader = hostHeaders[Math.floor(Math.random()*hostHeaders.length)];
			var attackerIP = chance.ip();
			var targetIP = chance.ip();
			if(done){return;}
			ws.send(JSON.stringify({ 
				"attackerLatitude": countries[attackerCountry][0],
				"attackerLongitude": countries[attackerCountry][1],
				"targetLongitude": countries[targetCountry][0],
				"targetLatitude": countries[targetCountry][1],
				"targetCountry": targetCountry,
				"attackerCountry": attackerCountry,
				"signatureName": signature,
				"attackerIP": attackerIP,
				"targetIP": targetIP,
				"hostHeader": hostHeader

			}));
			var randNumber = Math.random();
			setTimeout(repeat, randNumber * 1000);
		}
		repeat()
	});
}
