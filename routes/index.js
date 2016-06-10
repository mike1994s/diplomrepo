module.exports = function(app) {
    app.get('/', function(req, res) {
	console.log("/");
	res.send('Hello world!');
    })
    app.post('/enter', require('./enter').post);
    app.post('/startgame', require('./startgame').post);

}
