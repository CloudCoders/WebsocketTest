var socket = io.connect(window.location.host, {
    'sync disconnect on unload': true
});

var url = ''+window.location;
var room = url.split('/').pop();
socket.emit('joinRoom', {
    "idRoom": room,
    "type": "Controller"
});

var sendAnswer = function (selected) {
    var res = {
        "idRoom": room,
        "button": selected,
        "type": "Controller"
    };
    socket.emit("buttonPressed", res);
};

socket.on('roomStatus', function(data) {
    console.log(data);
    document.getElementById('users').innerHTML = "Usuarios conectados:" + data;
});


socket.on('gamePhase', function(data) {
    var html = `
	<h3>Pregunta 1: ${data.question}</h3>
	<ul>
	  <li><button type="button" onclick="sendAnswer('A')" id="A">${data.answers.a}</button></li>
	  <li><button type="button" onclick="sendAnswer('B')" id="B">${data.answers.b}</button></li>
	  <li><button type="button" onclick="sendAnswer('C')" id="C">${data.answers.c}</button></li>
	  <li><button type="button" onclick="sendAnswer('D')" id="D">${data.answers.d}</button></li>
	</ul>
  `;
    document.getElementById('content').innerHTML = html;
});
