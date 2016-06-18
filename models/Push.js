var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;
var _MAX_ATTEMPT_SEND_PUSH = 3;
var gcm = require('node-gcm');
var _DISTANCE_BETWEEN_PUSH = 20;
var _MAX_DELAY_FOR_DELETE = 1000;
var _MAX_ATTEMPT = 3;
var schema =  new Schema({
    reg_token : {
	type : String,
    },
   last_attempt_date: { 
	type: Date, 
	default: Date.now 
   },
   count_attempt : {
   	type : Number,
	default : 0,
   }, 
   leader_id : {
	type : String,	
   },
   id_game : {
	id_game : String, 
   },
   file : {
		originalname : String,
		encoding : String,
		mimetype: String,
		filename :  String,
		path : String,
		size : Number,
   },
   notified_users : {
	type : [String],	
   },
});
schema.statics.sendPush = function(tokens, vkID, gameId, file, allVks){
	sendPushIsNeedSave(tokens, vkID, gameId, file, allVks, true);
}
schema.statics.sendPushIsNeedSave = function(tokens, vkID, gameId, file, allVks, isNeedsave){
	var Push = this;
	var message = new gcm.Message();
	message.addData('leading',vkID);
	message.addData('id_game', gameId);
 	message.addData('file', file); 
	console.log("sendNOtification " + allVks);
	console.log("sendNOtification tokens " + tokens);
	message.addData('notify_vk',allVks ); 
	//https://github.com/ToothlessGear/node-gcm/blob/master/examples/notification.js
	//Add your mobile device registration tokens here
	var regTokens = tokens;
	//Replace your developer API key with GCM enabled here
	var sender = new gcm.Sender('AIzaSyDqbKDS6ATiItrcjIYJdsvbChpGnp_DrIc');
	if (isNeedsave){
			for (var i = 0; i < regTokens.length; ++i){
			var newPush = new Push({
				reg_token : regTokens[i],
				 leader_id : vkID,
				 id_game :  gameId,
				 file : file,
				 notified_users : allVks,
			});	
		newPush.save();
	}

	}
	sender.send(message, regTokens, function (err, response) {
   		if(err) {
      			console.error(err);
   		 } else {
      			console.log(response);
   		 }
	});	
}
schema.statics.rePush = function(){
	var Push = this;
	Push.find({}, function(err, pushes) {
		if (err){
			console.log(err);	
			return;	
		}
		for (var i = 0; i < pushes.length; ++i){
				var nowTime = new Date();
				var currentPush = pushes[i];
				var diff = Math.abs(nowTime.getTime() - currentPush.last_attempt_date.getTime()) ;
				if (diff > _DISTANCE_BETWEEN_PUSH){
					var tokens = [];
					tokens.push(currentPush.reg_token);

					Push.sendPushIsNeedSave(tokens, currentPush.leader_id, currentPush.id_game, currentPush.file, 
						currentPush.notified_users, false);
					currentPush.last_attempt_date = nowTime;
					currentPush.count_attempt++;
					currentPush.save();
				}
				 if (currentPush.count_attempt >=  _MAX_ATTEMPT) {
					Push.remove({reg_token : currentPush.reg_token, id_game : currentPush.id_game}, function (err) {
						if (err){
			 				console.log(err);
						}else {
			 				console.log("ok delete");
						}
	});
				}
		}
	});
}
exports.Push = mongoose.model('Push', schema); 
