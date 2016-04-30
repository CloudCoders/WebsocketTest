var newgame = require("../controllers/newgame.server.controller.js");

module.exports = function(app) {
    app.route('/newgame')
        .post(newgame.render);

    app.route('/newgame/:room')
        .get(newgame.renderP);
};
