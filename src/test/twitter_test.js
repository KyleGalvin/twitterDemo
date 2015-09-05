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
		twitterInstance.get("https://api.twitter.com/1.1/search/tweets.json?q=hello&count=10",function(error,tweets,response){
			if(!error){
				resolve(tweets)
			}else{
				reject(error)

			}
		})
	})
}


exports.twitter = {
	controller: function(test){
		var options= { count: 100};
		test.expect(1);

		var printTweets = function(data){
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

		//test.done();
	/*		test.ok(false, "response found: "+ JSON.stringify(response))
			if(response.tweetList){
				console.log("response",response)
				if(typeof(response) == "String"){
					test.ok(true, "response found: "+ JSON.stringify(response))
				}else{
					test.ok(false,"twitterController.query() failed"+response)
				}
			}
			test.done()
		})i*/
	}
}
