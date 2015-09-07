
//mongoose/mongoDB tools for saving and presenting twitter data
var twitterDataModel = require('./twitterDataModel')
twitterDataModel.init()

//start our stream to listen and collect data from twitter
var twitterListener = require('./twitterListener')

twitterListener.listen("bubblegum",twitterDataModel.save)//pass in our database event handler

//Create our web server
var webServer = require('./httpManager')

//user-friendly front-end located at webroot
webServer.createEndpoint("/",function(req,res){
	res.render('index')
})

//Configure our twitter API endpoint for reading/querying from our cached twitter database
var url = require('url')//url tools for parsing HTTP GET query parameters in our REST API
webServer.createEndpoint('/tweets',function(req,res){//express.js router behind the scenes
	var HTTPGETQueryJSON = url.parse(req.url,true).query;//turn HTTP GET query parameters into easy-to-use JSON structure
	//twitterDataModel handles any incoming requests and returns JSON data
	twitterDataModel.query(HTTPGETQueryJSON).then(function(responseJSON){
		res.json(responseJSON);
	})
})
webServer.createEndpoint('/tweetCount',function(req,res){//express.js router behind the scenes
	var HTTPGETQueryJSON = url.parse(req.url,true).query;//turn HTTP GET query parameters into easy-to-use JSON structure
	//twitterDataModel handles any incoming requests and returns JSON data
	twitterDataModel.count(HTTPGETQueryJSON).then(function(response){
		res.json({count:response});
	})
})

webServer.start()//start the web server

