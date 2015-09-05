var fs = require('fs');
var promise = require('bluebird')
var Twitter = promise.promisify(require('twitter'))

var authenticatedClient = null
var results = null
module.exports = {
	init: function(){
		var credentials = JSON.parse(fs.readFileSync('../twitterCredentials.json', 'utf8'));//decouple from repository
		if(!credentials){
			//if not found, this is the structure the twitter API requires
			credentials = {
				"consumer_key": "",
				"consumer_secret": "",
				"access_token_key": "",
				"access_token_secret": ""
			}
		}
		authenticatedClient =  new Twitter(credentials);


	},
	getResults: function(){
		return results;
	},
	query : function(searchTerm, offset, limit,test,callback){
		var results = {};
		var params = {screen_name: 'nodejs'};
		authenticatedClient.get('https://api.twitter.com/1.1/search/tweets.json?offset=20&limit=10&q=hello',
			params, 
			function(error,tweets,response){
				console.log("\n error: "+ JSON.stringify(error) + "\n")
				console.log("\n tweets: "+ tweets + "\n")
				if(!error){
					callback(tweets)
				}else{
					console.log("twitter GET with credentials throws error: " +JSON.stringify(error));
					results = null;
				}
			})
		
	}

}
