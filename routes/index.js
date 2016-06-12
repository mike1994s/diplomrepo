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
    app.post('/enter', require('./enter').post);
    app.post('/startgame', require('./startgame').post);
    app.post('/updatefcm', require('./updatefcm').post);

}
