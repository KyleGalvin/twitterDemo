var mongoose = require("mongoose")
exports.mongo = {
	setUp: function(callback){
		callback()
	},

	tutorial : function(test){
		mongoose.connect("mongodb://localhost/test")
		var db = mongoose.connection
		db.on('error', console.error.bind(console,'connection error:'))

		var kittySchema = mongoose.Schema({
			name: String
		})
		kittySchema.methods.speak = function () {
			test.ok(this.name == "fluffy")
		}
		db.once("open",function (callback){
			test.ok(true,'connection opened')
			var Kitten = mongoose.model('Kitten', kittySchema);
			var silence = new Kitten({name: "Silence"})
			test.ok(silence.name =="Silence","model insert working")

			var fluffy = new Kitten({ name: 'fluffy' });
			fluffy.speak(); // "Meow name is fluffy"

			test.expect(3)
			test.done()
		})

	}

}


