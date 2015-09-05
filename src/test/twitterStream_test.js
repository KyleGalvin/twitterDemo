var twitter = require('twitter');
var fs = require('fs');
var promise = require("bluebird");

var getCredentials = function(){
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
	return credentials;
}

var twitterInstance = new twitter(getCredentials());
var twitterSearchAsync = function(search,options){
	return new promise(function(resolve,reject){
		twitterInstance.stream('https://stream.twitter.com/1.1/statuses/sample.json',{ },function(stream){
			stream.on('data', function(tweet) {
				console.log("\ntweet\n"+JSON.stringify(tweet))
			})
		})
	})
}


exports.stream = {
	stream : function(test){
		var options= { count: 100};
		var endTest = function(){
			test.done()
		}

		twitterSearchAsync("hello",options)
		.then(endTest)
		.catch(function(e){
			test.ok(false,"\nerror:\n"+JSON.stringify(e))
			test.done()
		});
	}
}
