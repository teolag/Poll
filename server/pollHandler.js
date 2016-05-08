"use strict";
var socker = require('./sockerServer');
var Datastore = require('nedb');
var dbPolls = new Datastore({filename: __dirname + '/db/polls.db', autoload: true });
var dbAnswers = new Datastore({filename: __dirname + '/db/answers.db', autoload: true });


socker.on("new-poll", function(con, poll) {
	dbPolls.insert(poll, function(err, newPoll) {
		if(err) console.error("Error creating poll", err);
		else {
			console.log("Poll created!!", newPoll);
		}
	});
});

socker.on("poll-answered", function(con, answer) {
	dbAnswers.insert(answer, function (err, newAnswer) {
		if(err) {
			console.error("Error saving answer", err);
		} else {
			console.log("Answer saved", newAnswer);
		}
	});
});


function loadAllPolls(callback) {
	dbPolls.find({}, function(err, polls) {
		callback(polls);
	});
}


module.exports = {
	loadAll: loadAllPolls
};