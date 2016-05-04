var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('newgame');
});

router.post('/', function(req, res) {
    var roomlink = Math.random()*1000;

    res.render('newgameC', {
        roomlink: roomlink
    });
});

module.exports = router;
