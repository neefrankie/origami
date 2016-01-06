'use strict'
const Share = require('./src/js/share');

module.exports = {
	build: function (rootEl, socialList, config) {
		var shareInstance = Object.create(Share);
		shareInstance.init(rootEl, socialList, config);
		shareInstance.render();
		return shareInstance;
	},

	buildAll: function (el) {
		var shareInstances = [];
		if (!el) {
			el = document.body;
		} else if (!(el instanceof HTMLElement)) {
			el = document.querySelector(el);
		}

		var shareElements = el.querySelectorAll('[data-o-component=o-share]');
		
		for (var i = 0; i < shareElements.length; i++) {
			var shareInstance = Object.create(Share);
			shareInstance.init(shareElements[i]);
			shareInstance.render();
			shareInstances.push(shareInstance);
		}
		return shareInstances;
	}
};