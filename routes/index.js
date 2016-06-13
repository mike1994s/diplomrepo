module.exports = function(app) {
    app.get('/', function(req, res) {
	console.log("/");
	res.send('Hello world!');
    })
    app.get('/ping', function(req ,res){
	 res.json({
               code : "1",
               answer :"Ok",
               data : [],
	});

    });
var gcm = require('node-gcm');
    app.get('/testgcm', function(req,res){
                var message = new gcm.Message();

        message.addData('text', 'test');
                        var regTokens = [];
                        regTokens.push('cjX3zFBR4IE:APA91bFMXXTaZOfoRekYQQfRvwtpf6gYnBycyw9d8WWfpAfd7nJlNDYzDgy5qvvHpK6O8-UEhnBMYrwTzJPFCj954MLbtDv742tNujiJODmUQ3fAFIQXJMBFUegDe89-iLgQqSc7CFOh');
        //                      //Replace your developer API key with GCM enabled here
                                        var sender = new gcm.Sender('AIzaSyDqbKDS6ATiItrcjIYJdsvbChpGnp_DrIc');
        //
                                                sender.send(message, regTokens, function (err, response) {                                                              if(err) {
                res.json({
               code : "0",
               answer :err,
               data : [],
        });
        return;
}else {
                res.json({
               code : "1",
               answer :response,
               data : [],
        });
        return;
                                                         }                                                                                              });
        });

    app.post('/enter', require('./enter').post);
    app.post('/startgame', require('./startgame').post);
    app.post('/updatefcm', require('./updatefcm').post);
    app.post('/updateFriends', require('./updateFriends').post);
}
