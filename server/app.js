"use strict";

var http = require('http'),
	Logger = require('../../chat/server/Logger'),
	config = require('./config'),
	express = require('express'),
	routes = require('./routes'),
	app = express();

Logger("Start poll");
process.on("exit", processEnded);


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.listen(config.port, startListening);

var routes = routes(app);


function processEnded(code) {
	Logger("Process ended. Code " + code);
	console.log("\n \n \n");
}

function startListening() {
    Logger('Poll server is listening on port ' + config.port);
}




