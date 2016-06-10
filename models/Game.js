var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;
var schema =  new Schema({
	id_phone : String,
	word : String,
	file : {
		originalname : String,
		encoding : String,
		mimetype: String,
		filename :  String,
		path : String,
		size : Number,
	},  
});

exports.Game = mongoose.model('Game', schema); 
