var Twitter = require('twitter')
var fs = require('fs');
exports.twitter = {
	get: function(test){
		var credentials = JSON.parse(fs.readFileSync('../twitterCredentials.json', 'utf8'));//decouple from repository
		var client = new Twitter(credentials);

		var params = {screen_name: 'nodejs'};
		client.get('statuses/user_timeline',params, function(error,tweets,response){
			if(!error){
				test.ok(true,"twitter GET with credentials throws no error")
				console.log(tweets);
			}else{
				console.log(error);
				test.ok(false,"twitter GET with credentials throws error: " +JSON.stringify(error))
			}

			test.expect(1)
			test.done()
		});
	}
}
