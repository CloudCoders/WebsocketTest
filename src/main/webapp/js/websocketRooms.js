
var socket = null;
var sessionId = null;
var controllersId = null;

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
        sessionId = json.sessionId;
        document.getElementById('content').innerHTML = sessionId;
        var message = {
            action: "createRoom",
            id: sessionId,
            type: "Tv"
        };
        socket.send(JSON.stringify(message));
    }

    if (json.action === "controllerId") {
        controllersId[controllersId.legth-1] = json.controllerId;
        document.getElementById('content').innerHTML = controllerId;
        //TODO
    }

}


function printDeviceElement(device) {
}

