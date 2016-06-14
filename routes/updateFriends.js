var User = require('../models/User').User;
var _VK_TYPE = "vk";
var _FB_TYPE = "fb";

function arrayContain(arr, str){
	return (arr.indexOf(str) > -1);
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
	if (obj.type == _VK_TYPE){
		user.vk.id = obj.id;
		user.vk.friends = obj.friendsId;
	}
	return user.save();
})
.then(function(user){
  	var arr = user.vk.friends;
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
		res.json({
			code : "1",
			answer : "ok",
			data : [{
				user : user,
				friends : friendsId
			}],
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
