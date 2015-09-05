
var mongoose = require("mongoose")
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
var twitterSearchAsync = function(search,count){
	return new promise(function(resolve,reject){
		twitterInstance.get("https://api.twitter.com/1.1/search/tweets.json?q="+search+"&count="+count,function(error,tweets,response){
		//twitterInstance.get("https://api.twitter.com/1.1/geo/search.json?longitude=49&latitude=-123&granularity=city",function(error,tweets,response){
			if(!error){
				resolve(tweets.statuses)
			}else{
				console.log("\ninsideError:\n"+JSON.stringify(error))
				reject(error)
			}
		})
	})
}

exports.scrape = {
	scrape : function(test){
		test.expect(1)
		var count= 10;
		mongoose.createConnection("mongodb://localhost/test")
		var db = mongoose.connection
		db.on('error', console.error.bind(console,'connection error:'))
		var tweetSchema = mongoose.Schema({
			text: String,
			id: Number,
			created_at: String,
			user: {
				id: Number,
				name: String,
				screen_name: String,
				location: String
			},
			geo: String,
			coordinates: String
		},{strict: false})
		var tweet = db.model('tweet', tweetSchema);
		var removeAllTweets = function(){
			tweet.find().remove().exec();
		}	
		var createTweets = function(data){
			test.ok(true,"failed to create db objects from data: "+data)
			return tweet.create(data)
		}
		var printTweets = function(tweets){
			console.log("\ntweet count:\n"+JSON.stringify(tweets.length))

		}
		var queryTweets = function(){
			return tweet.find()
		}
		var endTest = function(){
			mongoose.connection.close()
			test.done()
		}
		twitterSearchAsync("bubblegum",count)//pull tweets from twitter
		//.then(removeAllTweets)
		.then(createTweets)//add tweets to database
		.then(queryTweets)//query from database (check that tweets got saved)
		.then(printTweets)//output/debugging
		.then(endTest)//cleanup
		.catch(function(e){
			test.ok(false,"\nerror:\n"+JSON.stringify(e))
			endTest()//cleanup
		})

	}
}
