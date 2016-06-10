var Dimension = require('./Dimension').Dimension;
var MapDimensionToPath = require('./Dimension').MapDimensionToPath;
var SimpleStrategy = require('./SimpleStrategy');
var uploadPhoto = require('./Saver').UploadPhoto;
var uploadVideo = require('./Saver').UploadVideo;
var uploadAudio = require('./Saver').UploadAudio;
var dimensions = [];



function init(){
	var dimOne = new Dimension(320, 200);
	var dimSec = new Dimension(640, 400);
	dimensions.push(new MapDimensionToPath(dimOne, "320x200", new SimpleStrategy()));
	dimensions.push(new MapDimensionToPath(dimSec, "640x400", new SimpleStrategy()));
}
init();
var dataGame =  require('./DataGame').DataGame;
var MediaData =  require('./DataGame').MediaData;
var GameData =  require('./DataGame').GameData;

function SaveData(body, file){
	var media = new MediaData(file.originalName,
	file.encoding, file.mimetype, file.filename, file.size);
	var userID = body.id_user;
	var word = body.word;
	var gameData = new GameData(userID, word, media);
	dataGame.add(gameData);
}

module.exports = function(app, http){
    app.get('/', function(req, res){
		res.render('index');
    });
	app.get('/joining/:room', function(req, res){
		var room = req.params.room;
		//console.log(room);
		res.cookie('user', room);
		res.cookie('isLead', '0');
		res.redirect('/chat');
	});
	app.get('/chat', function(req, res){
		res.render('chat');
	});
	app.get('/join', function(req, res){
		var roomsData = dataGame.getRooms();
		//console.dir(roomsData);
			res.render('rooms', {
                rooms: roomsData
            });
	});
	app.get('/create', function(req, res){
		var room = req.cookies['user'] || "";
		console.log("room is " + room);
		res.render('leading_page', {
			room : room
		});
	});
	app.get('/show', function(req, res){
		var all = dataGame.get();
		console.dir(all);
		res.send("ok");
	});
	app.post('/photo',function(req,res){
		uploadPhoto(req, res, function(err) {
			if(err) {
				console.log(err);
				return res.end("Error uploading file.");
			}
			console.log(req.body) // form fields
			console.log(req.file) // form files
			SaveData(req.body,req.file);
			res.cookie('user', req.body.id_user);
			res.cookie('isLead', '1');
			res.redirect("/create");
		});
	});

	app.post('/video',function(req,res){
		uploadVideo(req, res, function(err) {
			if(err) {
				console.log(err);
				return res.end("Error uploading file.");
			}
			console.log(req.body) // form fields
			console.log(req.file) // form files
			SaveData(req.body,req.file);
			res.cookie('user', req.body.id_user);
			res.cookie('isLead', '1');
			res.redirect("/create");
		});
	});
	
	app.post('/audio',function(req,res){
		uploadAudio(req, res, function(err) {
			if(err) {
				console.log(err);
				return res.end("Error uploading file.");
			}
			console.log(req.body) // form fields
			console.log(req.file) // form files
			SaveData(req.body,req.file);
			res.cookie('user', req.body.id_user);
			res.cookie('isLead', '1');
			res.redirect("/create");
		});
	});
    app.get('/load/:w/:h/:video', function(req, res){
		var w = req.params.w;
		var h = req.params.h;
		var videoName = req.params.video;
		var newDim = new Dimension(w, h);
		var index;
		var len = dimensions.length;
		var dimAppropriate;
		var min = 10000000000;
		for (index = 0; index < len; ++index) {
			var dif =  dimensions[index].getDiff(newDim);
			console.log(dif);
			if (min >dif){
				
				min = dif;
				dimAppropriate = dimensions[index];
			}	
		};
//	req.flash('info', 'Flashed message')
		var strPath = dimAppropriate.getPath();
		res.redirect('/'+strPath + "/" + videoName);
    });
};
