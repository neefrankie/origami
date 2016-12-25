import generateHtml from './generateHtml.js';

function getOgContent(metaEl) {
	if (!(metaEl instanceof HTMLElement)) {
		metaEl = document.querySelector(metaEl);
	}
	return metaEl.hasAttribute('content') ? metaEl.getAttribute('content') : '';
}

// Get page meta content statically. Should not put this inside the `Share` object in order to reduce DOM traverse.
const defaultConfig = {
	url: window.location.href || '',
	summary: getOgContent('meta[property="og:description"]'),
	title: getOgContent('meta[property="og:title"]')
};

class Share {
	constructor(rootEl, config) {
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}

    if (!config) {
      config = {};
      Array.prorotype.forEach.call(rootEl.attributes, function (attr) {
      	if (attr.name.indexOf('data-o-share') === 0) {
          const key = attr.name.replace('data-o-share-', '');
          try {
            config[key] = JSON.parse(attr.value.replace(/\'/g, '"'));
          } catch (e) {
            config[key] = attr.value;
          }
        }
      });
    }

    this.rootEl = rootEl;
		this.config = Object.assign(config, defaultConfig);
		this.openWindows = {};

		if (rootEl.children.length === 0) {
			this.handleClick = this.handleClick.bind(this);
			this.render();
			this.rootEl.addEventListener('click', this.handleClick);
			this.rootEl.setAttribute('data-o-share--js', '');
		}
	}

	render() {
		this.rootEl.innerHTML = generateHtml(this.config);
	}

	handleClick(e) {
		let target = e.target;
		e.preventDefault();
		while (target.nodeName !== 'A') {
			target = target.parentNode
		}
		this.shareSocial(target.href);
	}

	shareSocial(url) {
		if (url) {
			if (this.openWindows[url] && !this.openWindows[url].closed) {
				this.openWindows[url].focus();
			} else {
				this.openWindows[url] = window.open(url, '', 'width=646,height=436');
			}
		}
	}

	static init(el) {
		const shareInstances = [];

		if (!el) {
			el =document.body;
		} else if (!el instanceof HTMLElement) {
			el = document.querySelector(el);
		}

		const shareElements = el.querySelectorAll('[data-o-component=o-share]');

		for (let i = 0; i < shareElements.length; i++) {
			shareInstances.push(new Share(shareElements[i]));

		}

		return shareInstances;
	}
}

export default Share;