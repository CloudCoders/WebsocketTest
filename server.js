process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('./config/express');
var app = express();

app.get('server').listen(3000);
module.exports = app;

console.log("Server runing at port 3000");
