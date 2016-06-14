var Winners = require('../models/Winners').Winners;
var _VK_TYPE = "vk"; 
exports.get = function(req, res) {
	var ids = req.params.ids.split(',');
	var type = req.params.type;
	var promise = Winners.find({}).exec();
	promise.then(function(winners) {
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
		console.log(map);
		var answer = [];
		
		ids.map(function(id){
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
				winners: answer,
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
};
