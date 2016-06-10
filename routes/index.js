module.exports = function(app) {
    app.get('/', function(req, res) {
	res.render("leading_page");
    })
    app.post('/enter', require('./enter').post);
    app.post('/startgame', require('./startgame').post);

}
