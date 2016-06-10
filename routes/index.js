module.exports = function(app) {
    app.get('/', function(req, res) {
	console.log("/");
	res.send('Hello world!');
    })
    app.get('/ping', function(req ,res){
	 res.json({
               code : "0",
               answer :"empty field",
               data : [],
	});

    });
    app.post('/enter', require('./enter').post);
    app.post('/startgame', require('./startgame').post);

}
