Socker.connect('ws://xio.se:8051/', 'poll');
Sections.init();
var polls=null, pollToLoad, userId;



(function() {
	var cookie = document.cookie.match(/userId=([^;]+)/);
	if(cookie) {
		userId = cookie[1];
	} else {
		userId = Math.random().toString(36).substr(2);
		document.cookie = "userId=" + userId;
	}
}());



Nav.on({page:"pelle"}, function(state) {
	console.log("PELLES SIDA!!");
});

Nav.on({page:"lennart"}, function(state) {
	console.log("Lennarts sida");
});

Nav.on({page:"sida", id:55}, function(state) {
	console.log("Sida 55");
});

Nav.on({page:""}, function(state) {
	Sections.show("start");
});

Nav.on({page:"polls"}, function(state) {
	Sections.show("polls");

});

Nav.on({page:"new"}, function(state) {
	Sections.show("new");
});

Nav.on({page:"*"}, function(state) {
	Sections.show("poll");
	var pollId = state.page;
	if(polls === null) {
		pollToLoad = pollId;
	} else {
		loadPoll(pollId);
	}
});



Socker.on("poll-list", function(data) {
	polls = data.polls;
	updatePollList();

	if(pollToLoad) loadPoll(pollToLoad);
});



function loadPoll(pollId) {
	var poll = polls.find(function(p) {
		return p._id === pollId
	});
	var title = document.querySelector(".poll-question");
	var answerList = document.querySelector(".answer-list")
	if(poll) {
		title.textContent = poll.question;
		answerList.innerHTML = poll.answers.map(function(answer, index) {
			return "<button type='button' class='answer' data-index='"+index+"' data-poll_id='"+poll._id+"'>" + answer + "</button>";
		}).join("");
	} else {
		answerList.innerHTML = "";
		title.textContent = "Poll not found";
	}
}

function updatePollList() {
	var list = document.querySelector(".poll-list");
	list.innerHTML = polls.map(function(poll) {
		return "<a href='/"+poll._id+"'>" + poll.question + "</a>";
	}).join("");
}