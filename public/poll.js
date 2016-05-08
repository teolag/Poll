

// Create poll
(function() {
	if(document.forms.hasOwnProperty("pollCreate")) {
		var form = document.forms.pollCreate,
			answerList = form.querySelector(".answer-list"),
			lastAnswer = form.elements.answer;

		form.addEventListener("submit", submitNewPoll, false);
		answerList.addEventListener("keydown", answerTyping);

		function answerTyping(e) {
			if(e.target === lastAnswer && e.target.value!=='') {
				createNewAnswer();
			}
		}

		function createNewAnswer() {
			var newAnswerLi = document.createElement("li");
			var newAnswerInput = document.createElement("input");

			newAnswerInput.name = "answer";
			newAnswerInput.type = "text";

			newAnswerLi.appendChild(newAnswerInput);
			answerList.appendChild(newAnswerLi);
			lastAnswer = newAnswerInput;
		}

		function submitNewPoll(e) {
			e.preventDefault();
			var poll = { question: e.target.elements.question.value, answers: [] };
			var answers = e.target.elements.answer;
			for(var i=0; i<answers.length; i++) {
				if(answers[i].value.trim()!=="") {
					poll.answers.push(answers[i].value);
				}
			}
			Socker.send("new-poll", poll);
		}
	}
}());


var answerButtons = document.querySelector(".answer-list");
answerButtons.addEventListener("click", function(e) {
	if(e.target.nodeName !== "BUTTON") return;
	var pollId = e.target.dataset.poll_id;
	var index = parseInt(e.target.dataset.index);
	console.log("click on", pollId, index);
	Socker.send("poll-answered", {pollId:pollId, index:index, userId:userId});
});

