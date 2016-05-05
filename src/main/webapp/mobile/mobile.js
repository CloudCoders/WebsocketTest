/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var socket = null;
var controllerId = null;
var sessionIdTv = null;

window.onload = getVarsUrl;

function createConection() {
    if (socket === null) {
        socket = new WebSocket("ws://" + window.location.host + "/WebsocketQuiz/rooms");
        socket.onmessage = onMessage;
        //socket.onopen = addDevice;
    }
}


function onMessage(event) {
    var json = JSON.parse(event.data);

    if (json.action === "sessionId") {
        controllerId = json.sessionId;
        document.getElementById('session').innerHTML = '<p>Id: '+controllerId+'</p>';
        var message = {
            action: "joinRoom",
            idRoom: sessionIdTv,
            type: "Controller"
        };
        socket.send(JSON.stringify(message));
    }
}

function getVarsUrl() {
    var ur = window.location.href;
    if (ur.indexOf('sessionid') !== -1) {
        //var verifier = "";
        ur = ur.substring(ur.indexOf('?') + 1);
        var urPartes = ur.split('&');
        for (i = 0; i < urPartes.length; i++) {
            if (urPartes[i].indexOf('sessionid') !== -1) {
                sessionIdTv = urPartes[i].split('=')[1];
            }
        }
    }
    createConection();
}