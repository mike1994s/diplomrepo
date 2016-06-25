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

    app.get('/test-gcm',require('./testgcm').get); 

    app.post('/enter', require('./enter').post);
    app.post('/create-game', require('./startgame').post);
    app.post('/update-fcm', require('./updatefcm').post);
    app.post('/update-friends', require('./updateFriends').post);
    app.get('/get-statistic/:type/:ids', require('./statistics').get);
    app.post('/confirm-push', require('./confirmpush').post);
    app.post('/exit', require('./exit').post);
}
