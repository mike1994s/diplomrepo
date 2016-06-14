var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;
var _VK_TYPE = "vk";
var _FB_TYPE = "fb";
var schema =  new Schema({
    id_game : {
	type : String,
    },
    date: { 
	type: Date, 
	default: Date.now 
   },
   word : {
   	type : String,
   },  
   vk : {  
     	id : {
	    type : String,
  	}
   },
});
exports.Winners = mongoose.model('Winners', schema); 
