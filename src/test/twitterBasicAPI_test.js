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
		twitterInstance.get("https://api.twitter.com/1.1/search/tweets.json?q=bubblegum&count=10",function(error,tweets,response){
		//twitterInstance.get("https://api.twitter.com/1.1/geo/search.json?longitude=49&latitude=-123&granularity=city",function(error,tweets,response){
			if(!error){
				resolve(tweets.statuses)
			}else{
				reject(error)
			}
		})
	})
}


exports.twitter = {
	setUp: function(callback){
		callback()
	},
	twitterAPI: function(test){
		var options= { count: 100};

		var printTweets = function(data){
			//console.log("\ndata:\n"+JSON.stringify(data))
			/*
			for(var i=0;i<data.length;i++){
				console.log("\ndata:\n"+JSON.stringify(data[i].coordinates)+ JSON.stringify(data[i].text))

			}
			*/
			test.ok(data != null,"\ndata:\n"+JSON.stringify(data))
		}
		var endTest = function(){
			test.done()
		}
		twitterSearchAsync("hello",options)
		.then(printTweets)
		.then(endTest)
		.catch(function(e){
			test.ok(false,"\nerror:\n"+JSON.stringify(e))
			test.done()
		});

	}

}
