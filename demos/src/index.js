var frames = document.querySelectorAll('.demo__frame');

frames.forEach(function(frame) {
	frame.onload = function() {
		var doc = frame.contentDocument;
		var html = doc.documentElement;
		var height = html.offsetHeight;
		frame.style.height = height + 'px';
	}
});