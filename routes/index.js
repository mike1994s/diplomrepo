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

    app.get('/testgcm',require('./testgcm').get); 

    app.post('/enter', require('./enter').post);
    app.post('/startgame', require('./startgame').post);
    app.post('/updatefcm', require('./updatefcm').post);
    app.post('/updateFriends', require('./updateFriends').post);
    app.get('/getStatistic/:type/:ids', require('./statistics').get);
    app.post('/confirmpush', require('./confirmpush').post);
}
