# WebsocketQuiz
Experimental web game using smartphones as a remote control
<h2>Objetivo primera version</h2>
<p>
Mostrar en tiempo real la pulsacion de botones de los mandos en una sala.
</p>

<h2>Prerrequisitos</h2>
<p>
1) Es un proyecto netbeans<br/>
2) Testeado sobre servidores Glassfish 4 o Tomcat 7
</p>

<h2>Uso en local</h2>
<p>
  1) Desplegar en servidor<br/>
  2) Crear una sala nueva usando la interfaz<br/>
  3) Escanear el codigo Qr con el movil o abrir en un navegador diferente la pagina asociada<br/>
  pasandole como parametro en la url el #idsession=*******<br/>
  4) IMPORTANTE: Si se ha escaneado desde el movil cambiar el localhost de la url por la ip <br>
  privada del equipo donde se ha desplegado el servidor (Si el movil esta en la misma red wifi que el server). <br/>
  Ej 192.168.1.130
</p>
<h2>Conf Cliente</h2>
<p>
<ol>
<li>Escanear el codigo Qr y obtener el idSession de la tv.</li>
<li>Crear Websocket: new WebSocket("ws://websocketquiz-armandomg.rhcloud.com:8000/WebsocketQuiz/rooms")</li>
<li> Nada mas iniciar la conexion se recibira un json con id de la sesion del controlador: <br/>
{"action":"sessionId", "sessionId": **** }</li>
<li> Cuando se obtenga el idSession de la tv y del controlador enviar una peticion con el siguiente JSON para
unirse a la sala correspondiente.<br/>
{"action": "joinRoom", "idRoom": variable (sessionIdTv), "type": "Controller"}</li>
<li> Cada vez que se pulse un boton, enviar el siguiente JSON:<br/>
{"action": "buttonPressed", "idRoom": variable (sessionIdTv), "button": variable (button), "type": "Controller"}<br/>
La variable button tomara los siguientes valores segun el boton pulsado: 'circle', 'red', 'green', 'blue', 'yellow'.</li>
</ol>
</p>


