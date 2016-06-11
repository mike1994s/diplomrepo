var socketIO = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var Files = {};
var GameModel = require('../models/Game').Game;

var ffmpeg = require('fluent-ffmpeg');
var numUsers = 0;
var dataGame =  require('./DataGame').DataGame;
   	function Game(idRoom){
		this.isActive = true;
		this.idRoom = idRoom;
		this.error = null;
		this.gameModel;	
		this.masterSocket = null;
		this.sockets = [];
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
	function getArrUserByRoomVkId(idRoom){
		var game = getGameById(idRoom);
		var sockets = game.sockets;
		var arr = [];
		if (game.masterSocket != null)
			arr.push(game.masterSocket.vk);
		for (var i = 0; i < sockets.length; ++i){
			arr.push(sockets[i].vk);
		}
		return arr;
	}
module.exports = function(http){
	var io = socketIO.listen(http);
	io.sockets.on('connection', function (socket) {
		console.log("connection");
		 socket.on('handshake',function(user){
   			socket.join(user.id_room);
			socket.room = user.id_room;
			socket.vk = user.vk_id;
			console.log(socket.room + "   " + user.vk_id);
			console.log(user.game);
			var allVks = getArrUserByRoomVkId(socket.room);
			addInCurrentOrCreateRoom(socket.room, socket, user.is_lead, user.game);
			io.to(socket.room).emit('new user', { message :user.vk_id + " has joined.",
								id : user.vk_id,
								vks : allVks});
		 })
		
		socket.on('start_game', function(data){
			var game = getGameById(socket.room);
			var data = {};
			data.file = game.gameModel.file.path;
			data.message = "start game";
			io.to(socket.room).emit('on_start_game',data);
		});

		socket.on('word', function(word){
			var game = getGameById(socket.room);
			var wordLowerCase = game.gameModel.word.toLowerCase(); 
			
			var prevWordLowerCase =word.toLowerCase();
			var answer = {word : word , vk : socket.vk};
			if (wordLowerCase == prevWordLowerCase){
				io.to(socket.room).emit('win', answer);
			}else {
				io.to(socket.room).emit('word', answer);
			}
			if (game.masterSocket != null){
				game.masterSocket.emit('estimate', answer);
			}	
		})
	      socket.on('better', function(word){
			console.log(word);
			io.to(socket.room).emit('better_word', word);
	      });	
	      socket.on('worse', function(word){
			console.log(word);
			io.to(socket.room).emit('worse_word', word);
	      });	
	      socket.on('winner', function(data){
			console.log(data.word);
			io.to(socket.room).emit('win',data);
	      });
	      socket.on('test', function(data){
			console.log(data.word);
			io.sockets.emit('test',data);
	      });
			
	});
	
	return io;
};
