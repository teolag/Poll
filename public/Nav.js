var Nav = (function() {

	var activeState;
	var watchList = [];
	addEventListener("popstate", popState, false);
	addEventListener("DOMContentLoaded", function() {
		var path = document.location.pathname;
		var currentState = path2State(path);
		matchStates(currentState);
	}, false);
	addEventListener("click", function(e) {
		if(e.target.nodeName === 'A') {
			e.preventDefault();
			goto(e.target.pathname);
		}
	});

	function popState(e) {
  		console.log("StatePop", "location: " + document.location + ", state: " + JSON.stringify(e.state));
		matchStates(e.state);
	}

	function matchStates(state) {
		watchList.find(matchState);

		function matchState(watched) {
			var watchedKeys = Object.keys(watched.state);
			var match = watchedKeys.every(function(key) {
				if(watched.state[key] === state[key]) return true;
				if(watched.state[key] === "*" && state[key] !== "") return true;
				return false;
			});
			if(match) {
				activeState = state;
				watched.callback(state);
				return true;
			}
		}
	}


	function loadState() {
		console.log("load state", activeState);
		Pages.open(activeState.page, activeState.id);
	}

	function path2State(path) {
		var info = path.replace(/^\//, "").split('/');
		var state = {};
		state.page = info[0];
		if(info[1])	state.id = parseInt(info[1]);
		return state;
	}

	function goto(url, state) {
		if(!state) state = path2State(url);
		if(JSON.stringify(activeState) === JSON.stringify(state)) return;

		history.pushState(state, null, url);
		matchStates(state);
	}

	function addStateListener(state, callback) {
		watchList.push({state:state, callback:callback});
	}

	return {
		goto: goto,
		on: addStateListener
	};
}());