"use strict";
var Datastore = require('nedb'),
	Logger = require('../../chat/server/Logger'),
	bodyParser = require('body-parser'),
	dbPolls = new Datastore({filename: __dirname + '/db/polls.db', autoload: true }),
	dbAnswers = new Datastore({filename: __dirname + '/db/answers.db', autoload: true });


module.exports = function(app) {
	app.use(bodyParser.urlencoded({ extended: false }));

	app.get('/', function(req, res) {
		res.render("index");
	});

	app.get('/new', function(req, res) {
		res.render('poll_create', { title: 'Hey', message: 'Hello there!'});
	});

	app.post('/new', function(req, res) {
		Logger("spara?!", req.body);
		var answers = [];
		for(var i=0; i<req.body.answer.length; i++) {
			var answer = req.body.answer[i];
			if(answer !== '') answers.push({answer:answer});
		}
		var poll = {question: req.body.question, answers: answers};
		dbPolls.insert(poll, function (err, newPoll) {
			if(err) {
				console.error("Error creating poll", err);
				res.send("erroooorr");
			} else {
				res.render("poll_created", {poll: newPoll});
			}
		});
	});

	app.get('/:id', function(req, res) {
		getPoll(req.params.id, res, function(poll) {
			res.render('poll', {poll:poll});
		});
	});

	app.post('/:id', function(req, res) {
		var pollId = req.params.id;
		Logger("answer poll", pollId, req.body.answer);
		var answer = {pollId: pollId, index: parseInt(req.body.answer)};
		dbAnswers.update(answer, {$inc: {counter:1}}, {upsert: true}, function (err, numReplaced, upsert) {
			if(err) {
				console.error("Error creating poll", err);
				res.send("erroooorr");
			} else {
				res.send("Tack!");
			}
		});
	});

	app.get('/:id/results', function(req, res) {
		getPoll(req.params.id, res, function(poll) {
			dbAnswers.find({ pollId: poll._id }, function (err, counters) {
				console.log("counters", counters);
				var totalAnswers=0;
				for(var i=0; i<counters.length; i++) {
					var count = counters[i];
					poll.answers[count.index].count = count.counter;
					totalAnswers += count.counter;
				}
				console.log("poll", poll);
				poll.totalAnswers = totalAnswers;
				res.render('poll_results', {poll:poll, counters: counters});
			});
		});
	});

}





function getPoll(pollId, res, callback) {
	dbPolls.findOne({_id: pollId}, function(err, poll) {
		if(err) console.error("Error db", err);
		else {
			if(poll) {
				callback(poll);
			} else {
				res.render('poll_not_found');
			}
		}
	});
}