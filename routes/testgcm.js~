var gcm = require('node-gcm');
exports.get = function(req, res) {
       var message = new gcm.Message();
        message.addData('text', 'test');
        var regTokens = [];
        regTokens.push('cjX3zFBR4IE:APA91bFMXXTaZOfoRekYQQfRvwtpf6gYnBycyw9d8WWfpAfd7nJlNDYzDgy5qvvHpK6O8-UEhnBMYrwTzJPFCj954MLbtDv742tNujiJODmUQ3fAFIQXJMBFUegDe89-iLgQqSc7CFOh'); 
        var sender = new gcm.Sender('AIzaSyDqbKDS6ATiItrcjIYJdsvbChpGnp_DrIc');
    
        sender.send(message, regTokens, function (err, response) {     
            if(err) {
	    	    res.json({
	    		   code : "0",
	      		   answer :err,
		          data : [],
			});
        		return;
		}
             res.json({
              	code : "1",
                answer :response,
                data : [],
        	});
          return;
     });
};
