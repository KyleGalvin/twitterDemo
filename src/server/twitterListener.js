var twitter = require('twitter');
var fs = require('fs');
var promise = require("bluebird");

var saveCallback = null
var vancouverBoundingBox = [[-122.616226,49.746292],[-123.616226,48.746292]]

//the twitter API location parameter works as a logical OR, rather than AND. 
//Here we add a filtering step based on the Vancouver bounding box
var filterLocationBeforeSave = function(tweet){
	if(tweet.place && tweet.place.bounding_box && tweet.place.bounding_box.coordinates){
		var coordinates = tweet.place.bounding_box.coordinates
		//coordinates sometimes has several points of origin nested in a deep array. Let's just grab the first
		while(coordinates[0] instanceof Array){//when our elements are numbers we are at a [longitude,lattitude] structure
			coordinates = coordinates[0]
		}	
		console.log("point of origin:", coordinates)

		//use the separating axis theorem to detect tweets in Vancouver
		var isColliding = true
		if(coordinates[0] > vancouverBoundingBox[0][0] || coordinates[0] < vancouverBoundingBox[1][0]){
			isColliding = false
			console.log('failed 122-124')
		}
		if(coordinates[1] > vancouverBoundingBox[0][1] || coordinates[1] < vancouverBoundingBox[1][1]){
			isColliding = false
			console.log('failed 48-50')
		}

		//if we havent ruled out a collision yet, the tweet is from Vancouver and we want to keep it
		if(isColliding){
			console.log('saving vancouver tweet:',coordinates)
			saveCallback(tweet)
		}	
	}

}

var getCredentials = function(){
	var credentials = JSON.parse(fs.readFileSync('../twitterCredentials.json', 'utf8'));//decouple sensitive data from repository
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

var twitterStream = function(search){
	return new promise(function(resolve,reject){
		twitterInstance.stream('https://stream.twitter.com/1.1/statuses/filter.json',{track:search},function(stream){
			stream.on('data', filterLocationBeforeSave)
		})
	})
}

var twitterInstance = new twitter(getCredentials());

module.exports = {
	listen: function(keyword,DBSaveCallback){
		saveCallback = DBSaveCallback//callback we use to save tweet JSON to datamodel
		twitterStream(keyword)//pull tweets from twitter
	}
}
