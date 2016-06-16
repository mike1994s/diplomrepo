var User = require('../models/User').User;
var _VK_TYPE = "vk";
var _FB_TYPE = "fb";
var Winners = require('../models/Winners').Winners;
 
function arrayContain(arr, str){
	return (arr && arr.indexOf(str) > -1);
}

exports.post = function(req, res) {
    console.log("{/enter} have been called");
    console.log(req.body);
    var obj = req.body;
    if (!obj.idphone){
	res.json({
	       code : "0",
	       answer :"empty field",
	       data : [],
	});
	return;	
     }
	var type = _VK_TYPE;
var promise = User.findOne({'id_phone':obj.idphone}).exec();
promise.then(function(user) {
	
	if (user == null){
		res.json({
		       code : "0",
		       answer :"not found user",
		       data : [],
		});
		return;	
	} 
	type = obj.type;
	if (obj.type == _VK_TYPE){
		user.vk.id = obj.id;
		user.vk.friends = obj.friendsId;
	}
	return user.save();
})
.then(function(user){
  	var arr = user.vk.friends || [];
	var friendsId = [];
	User.find({} , function(err, users){
		if (err){
			res.json({
			       code : "0",
			       answer :"Error Users findAll",
			       data : [],
			});
			return;	
		}
		for (var i = 0; i < users.length; ++i){
			var idVk = users[i].vk.id;
			if (arrayContain(arr, idVk)){
				friendsId.push(idVk);
			}
		}

		var promiseWinners = Winners.find({}).exec();
		promiseWinners.then(function(winners) {
		var mapId = new Map();
		for (var i = 0; i < winners.length; ++i){
    			if (type == _VK_TYPE){
					var vkId = winners[i].vk.id;
					if (mapId.has(vkId)){
						var count = mapId.get(vkId);
						count++;
						mapId.set(vkId, count);
					}else {
						mapId.set(vkId, 0);
					}
				}

		}
		console.log(mapId);
		var answer = [];
		
		friendsId.map(function(id){
			var user = {};
			user.vk = id;
			if (mapId.has(id)){
				user.count_win = mapId.get(id);
			}else {
				user.count_win = 0;	
			}
			answer.push(user);
		});
	
			res.json({
			code : "1",
			answer : "ok",
			data : [{
				user : user,
				friends : answer
			}],
  	 });
		return;
	})
	.catch(function(err){
		console.log(err);
		res.json({
	       		code : "0",
	      		answer : err,
	      		 data : [],
		});
		  return;
    	});
	})
  	//return user.save();
})
.catch(function(err){
	console.log(err);
	res.json({
	       code : "0",
	       answer : err,
	       data : [],
		});
    	});	
};
