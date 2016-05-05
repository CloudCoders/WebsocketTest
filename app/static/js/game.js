var socket = io.connect(window.location.host, {
  'sync disconnect on unload': true
});

var url = ''+window.location;
var room = url.split('/').pop();
socket.emit('join', {room: room});

socket.on('roomStatus', function(data) {
  console.log(data);
  document.getElementById('users').innerHTML = "Usuarios conectados:"+data;
});

socket.on('starting', function(data) {
  document.getElementById('users').innerHTML = data;
})

socket.on('gamePhase', function(data) {
  var html = `
    <h4>${data.question}</h4>
    <ul>
      <li>${data.answers.a}</li>
      <li>${data.answers.b}</li>
      <li>${data.answers.c}</li>
      <li>${data.answers.d}</li>
    </ul>
  `;
  document.getElementById('content').innerHTML = html;
});
