var Sections = (function() {
	var sections = {},

	init = function() {
		var areas = document.querySelectorAll(".area");

		Array.from(areas).forEach(function(area) {
			sections[area.dataset.area] = area;
		});
	},

	show = function(area) {
		var areas = Object.keys(sections);
		for(var i=0; i<areas.length; i++) {
			sections[areas[i]].style.display = (areas[i]===area ? "" : "none");
		}
	}

	return {
		init: init,
		show: show
	}
}());