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
		var t = new tweet(twitterJSON)
		t.save()
	},
	query : function(query){//return subset of twitter data based on query parameters
		return tweet.find({'text': new RegExp(query.query,'i')}).sort({timestamp_ms:-1}).skip(query.offset).limit(query.limit);
	},
	drop : function(){//drop all mongoDB twitter data
		tweet.find().remove().exec();
	},
	count : function(query){
		return tweet.find({'text': new RegExp(query.query,'i')}).count({})
	} 

}
