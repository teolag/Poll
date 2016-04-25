

// Create poll
(function() {
	if(document.forms.hasOwnProperty("new_poll")) {
		var form = document.forms.new_poll,
			answerList = form.querySelector(".answer-list"),
			lastAnswer = form.elements.answer;

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
	}
}());

// Answer poll
/*
(function() {
	var answersContainer = document.querySelector(".answer-buttons");
	if(answersContainer) {

	}
}());
*/