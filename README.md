#ShadowBuster

https://indeedops.github.io/ShadowBuster/

This attack map is a visual representation of real time "attacks" or events starting


##How to use

The attack map communicates via web socket to a back end service that asynrounusly pushes events to the front end.

To configure the attack map to a backend websocket service, edit [this line](https://github.com/indeedops/ShadowBuster/blob/gh-pages/app.js#L1) to the appropriate web socket

###Example web socket payload

web socket messages should consist of the following json information

```json
{ 
		"attackerLatitude": 24.686,
		"attackerLongitude": 135.519,
		"targetLongitude": 114.174,
		"targetLatitude": 22.28,
		"targetCountry": "HK",
		"attackerCountry": "JP",
		"signatureName": "LDAP Injection attempt",
		"attackerIP": "8.8.8.8",
		"targetIP": "125.554.233.44",
		"hostHeader": "www.example.com"
}
```
