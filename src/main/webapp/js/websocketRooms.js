
var socket = null;
var sessionId = null;
var controllers = [];

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
        var message = {
            action: "createRoom",
            id: sessionId,
            type: "Tv"
        };
        socket.send(JSON.stringify(message));
        document.getElementById('info-room').innerHTML = '<p>Id: ' + sessionId + '</p>';
        createQr();
    }
    if (json.action === "controllerId") {
        controllers[controllers.length] = json;
        printDeviceElement(json);
    }
}

function createQr() {
    new QRCode(document.getElementById("info-room"), 
    window.location.href + "mobile/motionController.html#sessionId=" + sessionId);
}

function printDeviceElement(device) {
    var content = document.getElementById("devices");

    var deviceDiv = document.createElement("div");
    deviceDiv.setAttribute("id", device.controllerId);
    deviceDiv.setAttribute("class", "smartphone");
    content.appendChild(deviceDiv);

    var deviceName = document.createElement("span");
    deviceName.setAttribute("class", "name");
    deviceName.innerHTML = device.name;
    deviceDiv.appendChild(deviceName);
}

