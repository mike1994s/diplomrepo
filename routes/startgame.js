var Game = require('../models/Game').Game;
var path = require('path')
var User = require('../models/User').User;
var fs = require('fs');
var _VK_TYPE = "vk";
var _FB_TYPE = "fb"; 
var multer  = require('multer');
var gcm = require('node-gcm');
var upload = multer().single('file')
var storage =   multer.diskStorage({
	
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
	var extension = file.originalname.split('.').pop();
 
	console.dir(extension);
	console.dir(file);
    callback(null, file.fieldname + '-' + Date.now() + "." + extension);
  }
})

function sendNotification(){
	var message = new gcm.Message();
	return;
	message.addData('hello', 'world');
	message.addNotification('title', 'Hello');
	message.addNotification('icon', 'ic_launcher');
	message.addNotification('body', 'World');

	//https://github.com/ToothlessGear/node-gcm/blob/master/examples/notification.js
	//Add your mobile device registration tokens here
	var regTokens = [];
	//Replace your developer API key with GCM enabled here
	var sender = new gcm.Sender();

	sender.send(message, regTokens, function (err, response) {
   		if(err) {
      			console.error(err);
   		 } else {
      			console.log(response);
   		 }
	});
}
var uploadFile = multer({ storage : storage}).single('file');
exports.post = function(req, res) {
	console.log("{/startgame} have been called");
	 uploadFile(req, res, function (err) {
   		 if (err) {
      // An error occurred when uploading
		res.json({
			code :"0",
			answer : err + "",
			data : [],
			});
      		return;
   	 }
		var obj = req.body; // form fields
		if (!req.file || !obj.idphone || !obj.word){
			res.json({
				code :"0",
				answer :  "Not enough requirement field",
				data : [],
			});
			return;
		}
		game =  new Game({
 			id_phone: obj.idphone,
  			word: obj.word
		});
		var fileObj = {};
		var fileData = req.file;
		fileObj.originalname = fileData.originalname;
		fileObj.encoding = fileData.encoding;
		fileObj.mimetype = fileData.mimetype;
		fileObj.filename = fileData.filename;
		var fileName = fileData.path;
		fileName = fileName.substring(fileName.lastIndexOf('/')+1,fileName.length);
		fileObj.path = file;
		fileObj.size = fileData.size;
		game.file = fileObj;
		game.save(function (errSave, game, numAffected) {
  			if (errSave){
				res.json({
					code :"0",
					answer : errSave,
					data : [],
				});
			return;
			}
		 var promise = User.findOne({'id_phone':obj.idphone}).exec();
	         promise.then(function(user) {
	 		console.log("find" + user);
			if (user == null){
				res.json({
	      	   			code : "0",
	     	   			answer : "User Not Found",
	       				data : [],
				});
				return;
			}
			console.log(game); // form files
			sendNotification();
			res.json({
				code :"1",
				answer : "ok",
				data : [{
					game_one : game,
					user : user
				}],
			});

})
.catch(function(err){
	res.json({
	       code : "0",
	       answer : err,
	       data : [],
	});
  });	
		return;

	   });
       });
};
