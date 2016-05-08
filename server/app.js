"use strict";

var http = require('http'),
	config = require('./config'),
	socker = require('./sockerServer'),
	pollHandler = require('./pollHandler'),
	server = http.createServer(incomingRequest);

console.log("Starting Poll");
process.on("exit", processEnded);
server.listen(config.port, startListening);

socker.init(server, {
	allowedOrigin: config.allowedOrigin,
	allowedProtocol: config.allowedProtocol,
	connectCallback: connectCallback
});

function connectCallback(con) {
	pollHandler.loadAll(function(polls) {
		socker.sendTo(con, "poll-list", {polls:polls});
	});
}


function incomingRequest(req, res) {
	console.log("Incoming request", req.url);
	res.end("This is not the page you are looking for");
}

function processEnded(code) {
	console.log("Process ended. Code " + code);
	console.log("\n \n \n");
}

function startListening() {
    console.log('Poll server is listening on port ' + config.port);
}