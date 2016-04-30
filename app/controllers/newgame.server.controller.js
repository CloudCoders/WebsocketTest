exports.render = function(req, res) {
    var roomnm = Math.random()*1000;

    res.render('newgame', {
        roomname: roomnm,
        roomlink: "/newgame/"+roomnm
    });
};

exports.renderP = function(req, res) {
    var io = req.app.get('socketio');

    if(req.params.room) {
        io.on('connection', function(socket) {
            console.log(socket);
            socket.join(req.params.room);
        });
    }

    res.render('newgame',{
        roomname: req.params.room,
        roomlink: "Connected!"
    });
};
