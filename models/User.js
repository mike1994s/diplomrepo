var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;
var schema =  new Schema({
    name: {
        type: String,
	default : "",
    },
    id_phone:{
         type: String,
    },
   fsm : {
 	type: String,
   },
   vk : {  
     	id : {
	    type : String,
  	},
 	friends : [ String],
   },
});
exports.User = mongoose.model('User', schema); 
