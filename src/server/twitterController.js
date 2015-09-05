var fs = require('fs');
var promise = require('bluebird')
var Twitter = promise.promisifyAll(require('twitter'))

var authenticatedClient = null
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
		return new Twitter(credentials);
	},
	query : function(searchTerm, offset, limit){
		var results = {};
		console.log("\nquery called\n");
		var params = {screen_name: 'nodejs'};
		authenticatedClient.get('https://api.twitter.com/1.1/search/tweets.json?offset=20&limit=10&q=hello',
			params, 
			function(error,tweets,response){
				console.log("\n error: "+ JSON.stringify(error) + "\n")
				console.log("\n tweets: "+ tweets + "\n")
				if(!error){
					return tweets
				}else{
					console.log("twitter GET with credentials throws error: " +JSON.stringify(error));
					results = null;
				}
			})
		
	}

}
