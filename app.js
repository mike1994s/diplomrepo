//var app = require('http').createServer(handler)
/*
var express  = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var config = require('./config');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; 
app.use(busboy()); 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.static('Video'));
app.use(express.static('uploads'));
require('./routes')(app, http);
http.listen(process.env.OPENSHIFT_NODEJS_PORT || config.get('port'), ipaddress);

 

require('./app/socket.js')(http); 
*/

var express  = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var config = require('config');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; 
app.use(busboy()); 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.static('Video'));
app.use(express.static('uploads'));
require('routes')(app, http);


app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

http.listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

require('app/socket.js')(http); 

/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/
