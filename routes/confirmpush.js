var Push = require('../models/Push').Push;

exports.post = function(req, res) {
	var regtoken = req.body.regtoken;
	var idgame = req.body.idgame;
	Push.remove({reg_token : regtoken, id_game : idgame}, function (err) {
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
	});
}

