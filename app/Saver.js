var multer  =   require('multer');

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
});



var uploadPhoto = multer({ storage : storage}).single('userPhoto');
var uploadVideo = multer({ storage : storage}).single('userVideo');
var uploadAudio = multer({ storage : storage}).single('userAudio');



exports.UploadPhoto = uploadPhoto;
exports.UploadVideo = uploadVideo;
exports.UploadAudio = uploadAudio;

