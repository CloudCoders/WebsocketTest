var socket = io.connect(window.location.host);

var url = '' + window.location;
$("#startButton").hide();
var room = url.split('/').pop();
socket.emit('joinRoom', {
    "idRoom": room,
    "type": "Master"
});

var startGame = function () {
    socket.emit("start", {
        "idRoom": room,
        "type": "Master"
    });
};

socket.on('roomStatus', function (data) {
    $("#startButton").hide();
    document.getElementById('users').innerHTML = "Usuarios conectados:" + data;
});

socket.on('clearToStart', function (data) {
    $("#startButton").show();
});

socket.on('gamePhaseM', function (data) {
    var html = `
	<h3>Pregunta 1: ${data.question}</h3>
	<ul>
	  <li><button type="button" id="A">${data.answers.a}</button></li>
	  <li><button type="button" id="B">${data.answers.b}</button></li>
	  <li><button type="button" id="C">${data.answers.c}</button></li>
	  <li><button type="button" id="D">${data.answers.d}</button></li>
	</ul>
  `;
    document.getElementById('content').innerHTML = html;
});
/**
 * Created by Cotel on 23/05/2016.
 */
