//start our web server and define our routing endpoints via express.js
//express for server routing and virtual paths
var express = require("express")
var app = express()

module.exports ={
	start : function(){
		//link to various source directories
		app.use(express.static(__dirname + '/../client'))//public-facing client scripts
		app.set( 'views', __dirname + '/../views' )//ejs view templates

		app.set( 'view engine', 'ejs' )//view rendering engine
		 
		 
		//configure web server with settings defined above
		var webserver = require('http').createServer(app)

		//begin our configured webserver
		webserver.listen(80)
	},
	createEndpoint: function(endpoint,callback){
		app.get(endpoint,callback)
	}
}
