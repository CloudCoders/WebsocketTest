from app import app, socketio

from flask import render_template, request, abort
from flask_socketio import join_room, emit, leave_room, rooms

import random
import json

rooms = {}
users = {}
masters = {}

@app.route('/')
@app.route('/index')
def index():
    if is_Mobile(request.headers.get('User-Agent')):
        return render_template('indexC.html')
    else:
        return render_template('index.html')

@app.route('/newgame', methods=['POST'])
def newgamePost():
    roomlink = random.getrandbits(128)
    rooms["%032x" % roomlink] = 0
    return render_template('newgame.html',
                            roomlink="%032x"%roomlink)

@app.route('/game/<string:room>')
def game(room):
    if not room in rooms:
        abort(404)

    if not is_Mobile(request.headers.get('User-Agent')):
        if not room in masters:
            return render_template('gameM.html')
    return render_template('game.html')


@socketio.on('joinRoom')
def on_join(data):
    print("Someone is joining " + data['idRoom'])
    room = data['idRoom']

    if data['type'] == "Master":
        masters[room] = request.sid
    else:
        users[request.sid] = room
        rooms[room] = rooms[room] + 1

    if rooms[room] < 5:
        join_room(room)
        emit('roomStatus', rooms[room], room=room)
    else:
        emit('roomStatus', 'Full room :(', room=request.sid)

    if rooms[room] == 4:
        emit("clearToStart", "", room=masters[room])

@socketio.on('disconnect')
def game_disconnect():
    print("Someone is leaving", request.sid)
    room = users[request.sid]
    users[request.sid] = None
    leave_room(room)
    rooms[room] = rooms[room]-1
    emit('roomStatus', rooms[room], room=room)


@socketio.on('start')
def on_start(data):
    room = data['idRoom']

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
    emit('gamePhaseM', question, room=masters[room])

@socketio.on('buttonPressed')
def on_answer(data):
    print(data)
    print("{} pressed button {}".format(request.sid, data['button']))


def is_Mobile(agentUser):
    phones = ['iphone', 'android']
    if any(phone in agentUser.lower() for phone in phones):
        return True
    else:
        return False
