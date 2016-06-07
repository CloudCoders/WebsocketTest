
var socket = null;
var sessionId = null;
var controllers = [];

function createConection() {
    if (socket === null) {
        socket = new WebSocket("ws://" + window.location.host + "/WebsocketQuiz/rooms");
        //socket = new WebSocket("ws://" + window.location.host + ":8000/WebsocketQuiz/rooms");
        socket.onmessage = onMessage;
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
        document.getElementById('debug').innerHTML = '<p>Abrir en otro navegador:<br/>' + window.location.href + "mobile/motionController.html#sessionid=" + sessionId + '</p>';

        createQr();
    }
    if (json.action === "controllerId") {
        controllers[controllers.length] = json;
        printDeviceElement(json);
    }
    if (json.action === "buttonPressed") {
        /* Unico metodo que usa jquery por problemas con querySelector*/
        $('#' + json.sessionId + ' .' + json.button + '').animate({
            opacity: 0.2
        }, 100, function() {
            $(this).animate({opacity: 1}, 100)
        });
    }
}

function createQr() {
    new QRCode(document.getElementById("info-room"),
            window.location.href + "mobile/motionController.html#sessionid=" + sessionId);
}

function animationOpacity(node) {
    node.style.opacity = 0.5;
    setTimeout(function() {
        node.style.opacity = 1;
    }, 1000);
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

    var circleButton = document.createElement("input");
    circleButton.setAttribute("type", "button");
    circleButton.setAttribute("class", "circle");
    circleButton.setAttribute("disabled", "true");
    deviceDiv.appendChild(circleButton);

    var redButton = document.createElement("input");
    redButton.setAttribute("type", "button");
    redButton.setAttribute("class", "answer-option red");
    redButton.setAttribute("disabled", "true");
    deviceDiv.appendChild(redButton);

    var greenButton = document.createElement("input");
    greenButton.setAttribute("type", "button");
    greenButton.setAttribute("class", "answer-option green");
    greenButton.setAttribute("disabled", "true");
    deviceDiv.appendChild(greenButton);

    var blueButton = document.createElement("input");
    blueButton.setAttribute("type", "button");
    blueButton.setAttribute("class", "answer-option blue");
    blueButton.setAttribute("disabled", "true");
    deviceDiv.appendChild(blueButton);

    var yellowButton = document.createElement("input");
    yellowButton.setAttribute("type", "button");
    yellowButton.setAttribute("class", "answer-option yellow");
    yellowButton.setAttribute("disabled", "true");
    deviceDiv.appendChild(yellowButton);
}
