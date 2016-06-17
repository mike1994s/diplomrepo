var socketIO = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var Files = {};
var GameModel = require('../models/Game').Game;
var User = require('../models/User').User;
var Winner = require('../models/Winners').Winners;
var Push = require('../models/Push').Push;
var gcm = require('node-gcm');


var ffmpeg = require('fluent-ffmpeg');
var numUsers = 0;
var dataGame =  require('./DataGame').DataGame;


function arrayContain(arr, str){
	console.dir(arr);
	console.log(arr + " = array for found; found_ELEMENT " + str);
	return (arr.indexOf(str) > -1);
}
function sendNotification(tokens, vkID, gameId, file, allVks){
	Push.sendPush(tokens, vkID, gameId, file, allVks);
	return;
	var message = new gcm.Message();

	 
	message.addData('leading',vkID);
	message.addData('id_game', gameId);
 	message.addData('file', file); 
	console.log("sendNOtification " + allVks);
	console.log("sendNOtification tokens " + tokens);
	message.addData('notify_vk',allVks ); 
	//https://github.com/ToothlessGear/node-gcm/blob/master/examples/notification.js
	//Add your mobile device registration tokens here
	var regTokens =tokens;
	//Replace your developer API key with GCM enabled here
	var sender = new gcm.Sender('AIzaSyDqbKDS6ATiItrcjIYJdsvbChpGnp_DrIc');

	sender.send(message, regTokens, function (err, response) {
   		if(err) {
      			console.error(err);
   		 } else {
      			console.log(response);
   		 }
	});
}
function sendNotify(vkId, user, gameId){
	User.findOne({'vk.id':vkId}, function(err, userFound){
		if (err){
			return err;		
		}
		
		if (userFound == null || userFound.fsm == null){
			return ;		
		}
		console.log("user FSM " + userFound.fsm);
		var arr = [];
		arr.push(userFound.fsm);
		var game = getGameById(gameId);
		 
		var file = "";
		if (game.gameModel && game.gameModel.file && game.gameModel.file.path){
			file = game.gameModel.file.path;
		}
		sendNotification(arr, user, gameId, file, "");
		return "ok";
	});
}
function sendNotifyToMany(vkIds, user, gameId){
	User.find({}, function(err, usersFound){
		if (err){
			return err;		
		}
		
		if (usersFound == null){
			return ;		
		}
		var arr = [];
		var arrInvited = [];
		console.log("sendNotifyToMany " + usersFound.length);
		for (var i = 0; i < usersFound.length; ++i){
			if (arrayContain(vkIds, usersFound[i].vk.id.trim())){
				console.log("FOUND_USER" + usersFound[i].vk.id);
				arr.push(usersFound[i].fsm);
				arrInvited.push(usersFound[i].vk.id);
				console.log("user FSM vk id " + usersFound[i].vk.id);
			}
		}
		var game = getGameById(gameId);
		var file = "";
		if (game.gameModel && game.gameModel.file && game.gameModel.file.path){
			file = game.gameModel.file.path;
		}
		var invitedFriends = arrInvited.join(',');
		sendNotification(arr, user, gameId, file, invitedFriends);
		return "ok";
	});
}

   	function Game(idRoom){ 
		this.idRoom = idRoom;
		this.error = null;
		this.gameModel;	
		this.masterSocket = null;
		this.sockets = [];
		this.isStartGame = false;
		this.isGameFinished = false;
		this.vkWinner = "";
		this.invited_vk = [];
	}
	Game.prototype.socketsList = function(){
		return this.sockets;
	}
	Game.prototype.wasStartGame = function(){
		return this.isStartGame;	
	}
	Game.prototype.startGame = function(){
		this.isStartGame = true;
		this.isGameFinished = false;
	}
	Game.prototype.wasGameFinished = function(){
		return this.isGameFinished;	
	}
	Game.prototype.getWinner = function(){
		return this.vkWinner;
	}
	Game.prototype.toEndGame = function(vkWinner){
		if (this.isGameFinished){
			return ;
		}
		for (var i = 0; i < this.sockets.length; ++i){
			this.sockets[i].leave(this.idRoom);
		}
	//	this.isStartGame = false;
		this.isGameFinished = true;
		this.vkWinner = vkWinner;
		this.sockets = []; 
		if (this.gameModel){
			winner = new Winner({
	 			id_game: this.gameModel._id,
	  			word: this.gameModel.word,
			});
			winner.vk.id = vkWinner;
			winner.save(function (err) {
  				if (err) {
					console.log(err);
				}
				console.log("winner save");

			});
		}
		
	}
	Game.prototype.setInvitedVks = function(vks){
		this.invited_vk = vks;
	} 
	Game.prototype.add = function(socket, isLead, gameModel){
		if (isLead == true){
			this.masterSocket = socket;
			this.gameModel = gameModel;
		}else {
			this.sockets.push(socket);
		}
	}
	var games = [];
	function getGameById(idRoom){
		for (var i = 0; i < games.length; ++i){
			if (games[i].idRoom == idRoom){
				return games[i];
			}
		}
		var game = new Game(idRoom);
		var lastIndex = games.push(game);
		return games[lastIndex - 1];
	}
	
	function addInCurrentOrCreateRoom(idRoom, socket, isLead, gameModel){
		var game = getGameById(idRoom);
		game.add(socket, isLead, gameModel);
		console.log(games.length);
	} 
	function getArrUserByRoomVkId(idRoom, vkOfRequest){
		var game = getGameById(idRoom);
		var sockets = game.sockets;
		var arr = [];
		if (game.masterSocket != null) {
			if (vkOfRequest !=game.masterSocket.vk){
				arr.push(game.masterSocket.vk);
			}
		}	
		for (var i = 0; i < sockets.length; ++i){
			if (vkOfRequest !=game.masterSocket.vk){
				arr.push(sockets[i].vk);
			}
		}
		return arr;
	}
module.exports = function(http){
	var io = socketIO.listen(http);
	io.sockets.on('connection', function (socket) {
		console.log("connection");
		 socket.on('handshake',function(user){
   			console.log("handshake event");
			socket.room = user.id_room;
			socket.vk = user.vk_id;
			socket.join(user.id_room);
		//	console.log(socket.room + "   " + user.vk_id);
		//	console.log(user.game);
			var allVks = getArrUserByRoomVkId(socket.room, socket.vk);
			var objGame;
			 if (user.game){
                                objGame = JSON.parse(user.game);
                        }else {
                                objGame = {};
                        }
			addInCurrentOrCreateRoom(socket.room, socket, user.is_lead, objGame);
			var game = getGameById(socket.room);
			var fileGame = "";
			var word = "";
			var wasFinished = game.wasGameFinished();
			if (game.gameModel && game.gameModel.word && wasFinished){
				word = game.gameModel.word;
			}  
			
			if (game.gameModel && game.gameModel.file && game.gameModel.file.path){
				fileGame = game.gameModel.file.path;
			}
			
			var vkWinner = game.getWinner();
			socket.emit('handshake', {file : fileGame,
					     is_lead : user.is_lead,
					     was_finished : wasFinished,
					    vk_winner : vkWinner,
					    word : word});
			if (wasFinished){
				return;			
			}
			if (game.wasStartGame()){
				var data = {};
				data.file = game.gameModel.file.path;
				data.message = "start game";
				socket.emit('on_start_game',data);			
			}
			io.to(socket.room).emit('new_user', { message :user.vk_id + " ",
								id : user.vk_id,
								vks : allVks });
		 })
		socket.on('invite_new_user', function(userVk){
			console.log("invite_new_user");
			 
			sendNotify(userVk, socket.vk, socket.room);
			socket.emit('invite_new_user',"Ok");	
		});
		socket.on('invite_new_users', function(userVks){
			console.log("invite_new_users");
			console.log('invite_new_users' + userVks);
			var ids = userVks.split(',');
			console.log('invite_new_users' + ids);
			console.log('invite_new_users len' + ids.length);
			var game = getGameById(socket.room);
			game.setInvitedVks(ids);
			sendNotifyToMany(ids, socket.vk, socket.room);
			socket.emit('invite_new_user',"Ok");	
		});

		socket.on('start_game', function(data){
			console.log("start_game");
			var game = getGameById(socket.room);
			var data = {};
			game.startGame();
			data.file = "";
			if (game.gameModel.file){
				data.file = game.gameModel.file.path || "" ;
			}
			
			data.message = "start game";
			io.to(socket.room).emit('on_start_game',data);
		});

		socket.on('word', function(word){
			console.log("word");
			var game = getGameById(socket.room);
			var answer = {word : word, vk : socket.vk};
			if (!game.wasStartGame()){
				io.to(socket.room).emit('word', answer);
				return;
			}
			var wordLowerCase = game.gameModel.word.toLowerCase(); 
			
			var prevWordLowerCase =word.toLowerCase();
			
			if (wordLowerCase == prevWordLowerCase && game.masterSocket != socket){
				io.to(socket.room).emit('win', answer);
				 
				game.toEndGame(answer.vk);
			}else {
				io.to(socket.room).emit('word', answer);
			}
			if (game.masterSocket != null){
				game.masterSocket.emit('estimate', answer);
			}	
		})	
	      socket.on('better', function(word){
			console.log("better");
			console.log(word);
			io.to(socket.room).emit('better_word', word);
	      });	
	      socket.on('worse', function(word){
			console.log("worse");
			console.log(word);
			io.to(socket.room).emit('worse_word', word);
	      });	
	      socket.on('winner', function(data){
			console.log("winner");
			 
			var game = getGameById(socket.room);
			
			console.log(data.word);
			
			io.to(socket.room).emit('win',data);
	 
			game.toEndGame(data.vk );
	      });
	      socket.on('test', function(data){
			console.log("test");
			//console.log(data.word);
			io.sockets.emit('test',data);
	      });
			
	});
	
	return io;
};
