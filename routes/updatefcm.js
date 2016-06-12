var User = require('../models/User').User;

exports.post = function(req, res) {
    console.log("{/updatefcm} have been called");
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
    
    //console.log(obj.friendsId);
    var promise = User.findOne({'id_phone':obj.idphone}).exec();
promise.then(function(user) {
	//console.log("find" + user);
        if (user == null){ 
	res.json({
		code : "0",
		answer : "User Not found",
		data : [{
			user : user,
		}],
  	 });
	return;
	}else {
		user.fsm = obj.fsm;
		return user.save();
	}
})
.then(function(user){
  	console.log(user +" was updated");
         res.json({
		code : "1",
		answer : "ok",
		data : [{
			user : user,
		}],
  	 });

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
