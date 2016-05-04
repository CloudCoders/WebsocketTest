var express = require('express');
var router = express.Router();

var rooms = {};

router.get('/:room', function(req, res) {
    var room = req.param.room;

    if(room in rooms) {
        rooms.room = rooms.room+1;
    } else {
        rooms.room = 0;
    }

    res.render(
        "game",
        {room: room, numusers: rooms.room}
    );
});

module.exports = router;
