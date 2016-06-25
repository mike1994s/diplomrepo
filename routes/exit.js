var User = require('../models/User').User;

exports.post = function(req, res) {
     console.log("{/exit} have been called");
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
	User.findOne({'id_phone':obj.idphone}, function(err){
		if (err){
			res.json({
	       			code : "0",
	       			answer :err,
	       			data : [],
			});
		}else {
			res.json({
	       			code : "1",
	       			answer :"Ok",
	       			data : [],
			});
		}
	})
}
