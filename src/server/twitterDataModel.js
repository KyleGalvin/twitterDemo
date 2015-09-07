var mongoose = require("mongoose")

var db = null
var tweet = null

module.exports = {
	init : function(){
		mongoose.connect("mongodb://localhost/test")
		db = mongoose.connection
		db.on('error', console.error.bind(console,'connection error:'))
		tweetSchema = mongoose.Schema({},{strict: false})
		tweet = db.model('tweet', tweetSchema);
	},
	save : function(twitterJSON){//save incoming JSON to twitter datastore
		twitterJSON.unixTime = new Date(twitterJSON.created_at).getTime();//numerical unix time is easy to sort for pagination
		var t = new tweet(twitterJSON)
		t.save()
	},
	query : function(query){//return subset of twitter data based on query parameters
		console.log('q:',query.query)
		return tweet.find({'text': new RegExp(query.query,'i')}).skip(query.offset).limit(query.limit).sort({unixTime:-1});
	},
	drop : function(){//drop all mongoDB twitter data
		tweet.find().remove().exec();
	},
	count : function(){
		return tweet.count({})
	} 

}
