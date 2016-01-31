var socialShare = require('../main.js');


socialShare.build('.o-share');
/*socialShare.buildAll();*/

const DomDelegate = require('dom-delegate');
const TextCopyHelper = require('../src/js/TextCopyHelper');

var parentEl = document.querySelector('#ref');

function dispatchCustomEvent(event, data = {}, namespace = 'oShare') {
	parentEl.dispatchEvent(new CustomEvent(namespace + '.' + event, {
		detail: data,
		bubbles: true
	}));
}

new TextCopyHelper({
	message: "Copy this link for sharing",
	text: 'http://www.ftchinese.com',
	parentEl: parentEl,
	onCopy: function() {
		dispatchCustomEvent('copy', {
			share: 'oShare',
			action: "url",
			url: 'url'
		});
	},
	onDestroy: function() {
		parentEl.removeAttribute('aria-selected');
	}
});