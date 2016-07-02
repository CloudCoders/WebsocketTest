# Websocket Quiz

## Instalacion

Primero hay que instalar las dependencias

```
$ npm install
```

**Atención**: Para iniciar el juego se necesita una base de datos *MongoDB* corriendo en el host en el puerto estándar *27017*.

Para cargar las preguntas:

```
$ mongoimport -db Quiz --collection questions --file questions.json
```

## Ejecución

Para ejecutar

```
$ node app.js
```

Entonces entrar a `http://IP_del_host:3000/`

El primer dispositivo que entre a la partida actuara como master.
Se necesitan otros 4 dispositivos conectados para empezar la partida.
