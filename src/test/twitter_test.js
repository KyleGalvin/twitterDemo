var twitterController = require('../server/twitterController');
//var Promise = require("bluebird");

exports.twitter = {
	controller: function(test){
		twitterController.init()

		twitterController.query("hello",20,10,function(response){
			if(typeof(response) == "String"){
				test.ok(true, "response found: "+ JSON.stringify(response))
			}else{
				test.ok(false,"twitterController.query() failed"+response)
			}
		})
		test.expect(1)
		test.done()
	}
}
