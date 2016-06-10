module.exports = function(app) {
    app.get('/', function(req, res) {
	res.send('Hello world!');
    })
    app.post('/enter', require('./enter').post);
    app.post('/startgame', require('./startgame').post);

}
