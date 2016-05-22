from app import app, socketio

from flask import render_template, request
from flask_socketio import join_room, emit, leave_room, rooms

import random
import json

rooms = {}
users = {}

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/newgame', methods=['POST'])
def newgamePost():
    roomlink = random.getrandbits(128)
    return render_template('newgame.html',
                            roomlink="%032x"%roomlink)

@app.route('/game/<string:room>')
def game(room):
    return render_template('game.html')


@socketio.on('joinRoom')
def on_join(data):
    print("Someone is joining " + data['idRoom'])
    room = data['idRoom']

    users[request.sid] = room

    if room in rooms:
        rooms[room] = rooms[room]+1
    else:
        rooms[room] = 1

    if rooms[room] < 5:
        join_room(room)
        emit('roomStatus', rooms[room], room=room)
    else:
        emit('roomStatus', 'Full room :(', room=request.sid)

    if rooms[room] == 4:
        emit("starting", "Starting game", room=room)

        question = {
            "question": "En que año fue 1+1?",
            "answers": {
                "a": "0",
                "b": "El fantástico Ralph",
                "c": "2000",
                "d": "1234"
            }
        }

        emit('gamePhase', question, room=room)

@socketio.on('disconnect')
def game_disconnect():
    print("Someone is leaving", request.sid)
    room = users[request.sid]
    users[request.sid] = None
    leave_room(room)
    rooms[room] = rooms[room]-1
    emit('roomStatus', rooms[room], room=room)


@socketio.on('buttonPressed')
def on_answer(data):
    print("{} pressed button {}".format(request.sid, data['button']))
