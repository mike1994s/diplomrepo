function MediaData(originalName, encoding, mime, file, size){
	this.originalName =  originalName;
	this.encoding = encoding;
	this.mime = mime;
	this.size = size;
	this.fileName = file;
};


function GameData(leader, word ,media){
	this.leader = leader;
	this.word   = word;
	this.media = media;
}
function DataGame(){
	;
}

var singleton = function singleton(){
    //defining a var instead of this (works for variable & function) will create a private definition
   var _games = [];
   var _rooms = [];
   this.add = function(game){
		console.log(game);
		console.log(_games);
		 _games = _games.filter(function (el) {
                      return el.leader != game.leader;
			 });
		console.log(_games);
        _games.push(game);
    };
 
    this.get = function(){
        return _games;
    };
	this.addRoom = function(roomId){
		console.log("Add Room " + roomId);
		_rooms.push(roomId);
	}
	this.getRooms = function(){
		return _rooms;
	}
    if(singleton.caller != singleton.getInstance){
        throw new Error("This object cannot be instanciated");
    }
}
singleton.instance = null;
 
 
singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
    }
    return this.instance;
}
 
 
 
exports.DataGame = singleton.getInstance();
exports.MediaData = MediaData; 
exports.GameData = GameData; 
