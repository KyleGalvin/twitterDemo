
var twitterListener = require('../server/twitterListener')

exports.twitterListener = {
	listen: function(test){//collect 10 tweets from twitter stream with keyword "hello"
		test.expect(1)

		var tweetCount = 0;
		var testFinished = false;//prevent the tweet stream from calling test.done multiple times and messing up our test runner
		twitterListener.listenNoFilter("hello",function(tweetJSON){
			tweetCount += 1;
			if(tweetCount >=10 && !testFinished){
				testFinished = true
				test.ok(true,"receiving ten tweets from stream listener")
				test.done()
			}
		})
	}
}
