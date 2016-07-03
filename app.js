var express = require('express'),
	http = require('http'),
	io = require('socket.io');
require('./game/game.js');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/jquery', express.static(__dirname+'/node_modules/jquery/dist'));

var server = http.createServer(app);

server.listen(port, function() {
	console.log("Escuchando en puerto: " + port);
});
var socket = io.listen(server);

var games = {};

socket.on('connection', function(client) {
	client.on('message', function(message) {
		switch (message.action) {
			case 'join':
			handleJoin(message, client); break;
			case 'answer':
			handleAnswer(message, client); break;
			case 'buzz':
			handleBuzz(message, client); break;
			case 'requestNewID':
			handleNewId(message, client); break;
			case 'notifyId':
			handleNotifyId(message, client); break;
			default:
			break;
		}
		return true;
	});

	client.on('disconnect', function() {
		console.log(client.id + " disconnected");
		handleDisconnect(client);
	});
});

function registerGameCallbacks(game) {
	game.on('playerRemoved', function(session_id, players) {
		var data = {action: 'player_left', id: session_id, all: players};
		socket.sockets.emit('message', data);
	});

	game.on('newQuestion', function(question) {
		var data = {
			action: 'new_question',
			question: question.question,
			answers: question.answers
		};
		socket.sockets.emit('message', data);
	});

	game.on('correctAnswer', function(answer) {
		var data = { action: 'answer', answer: answer, correct: true };
		socket.sockets.emit('message', data);
	});

	game.on('incorrectAnswer', function(answer) {
		var data = { action: 'answer', answer: answer, correct: false };
		socket.sockets.emit('message', data);
	});

	game.on('scoreChanged', function(score) {
		var data = { action: 'score', score: score };
		socket.sockets.emit('message', data);
	});

	game.on('revealAnswer', function(answer, time_up) {
		var data = { action: 'reveal_answer', answer: answer, time_up: time_up };
		socket.sockets.emit('message', data);
	});

	game.on('timesUpOnBuzz', function(session_id) {
		var data = { action: 'answer', answer: '', correct: false };
		socket.sockets.emit('message', data);
	});
}

function handleJoin(data, client) {
	var game = games[data.game_id];

	if(!game) {
		game = new Game(data.game_id);
		games[data.game_id] = game;
		registerGameCallbacks(game);
	}

	var all_players = game.addNewPlayer(client.id);
	var data = { action: 'joined', id: client.id, all: all_players};
	client.send({action: 'identification', id: all_players});
	client.broadcast.emit('message', data);
}

function handleDisconnect(client) {
	for(var game in games) {
		var players = games[game].players;
		if(players[client.id] !== 'undefined') {
			games[game].removePlayer(client.id);
		}
	}
}

function handleNewId(data, client) {
	var game = games[data.game_id];
	var arr = [];
	var clients = socket.sockets.sockets;
	for(var s in clients) {
		arr.push(0);
		socket.to(s).emit('message', {
			action: 'identification',
			id: arr
		});
	}
}

function handleNotifyId(data, client) {
	var game = games[data.game_id];
	client.broadcast.emit('message', {
		action: 'idNotification',
		player: client.id,
		id: data.id
	});
}

function handleAnswer(data, client) {
	var game = games[data.game_id];
	console.log(data);
	game.playerAnswered(data, client.id);
}

function handleBuzz(data, client) {
	var game = games[data.game_id];
	game.playerBuzzed(data, client.id);
	client.send({action: 'you_buzzed'});
	client.broadcast.emit('message', {action:'someone_buzzed', id:client.id});
}
