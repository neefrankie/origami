const DomDelegate = require('dom-delegate');
const TextCopyHelper = require('./TextCopyHelper');

const socialUrls = {
	wechat: {
		name: "微信",
		url: "http://www.ftchinese.com/m/corp/qrshare.html?title={{title}}&url={{url}}&ccode=2C1A1408"
	},
	weibo: {
		name: "微博",
		url: "http://service.weibo.com/share/share.php?&appkey=4221537403&url={{url}}&title=【{{title}}】{{summary}}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005"
	},
	linkedin: {
		name: "LinkedIn",
		url: "http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{summary}}&source=FT中文网"
	},
	facebook: {
		name: "Facebook",
		url: "http://www.facebook.com/sharer.php?u={{url}}"
	},
	twitter: {
		name: "Twitter",
		url: "https://twitter.com/intent/tweet?url={{url}}&amp;text={{title}}&amp;via=FTChinese"
	},
	url: {
		name: "URL",
		url: "{{url}}"
	} 
};

// Get page meta content statically. Should not put this inside the `Share` object in order to reduce DOM traverse.
const fallbackConfig = {
	url: window.location.href || '',
	links: ['wechat', 'weibo', 'linkedin', 'facebook', 'twitter', 'url']
	summary: (function() {
			let descElement = document.querySelector('meta[property="og:description"]');
			if (descElement) {
				return descElement.hasAttribute('content') ? descElement.getAttribute('content') : '';
			}
			return '';
		})(),
	title: (function() {
			let titleElement = document.querySelector('title');
			if (titleElement) {
	//`innerText` for IE
				let titleText = (titleElement.textContent !== undefined) ? titleElement.textContent : titleElement.innerText;
				return titleText.split('-')[0].trim();
			}
			return '';
		})()
};

/*
config = {
	url: 'http://www.fthince.com',location.href.
	title: 'Article Title',
	summary: 'A short summary of the article',
	links: ['wechat', 'weibo', 'linkedin']
}
*/
function Share (rootEl, config) {
	const oShare = this;
	const openWindows = {};

	function init() {
		if (!rootEl) {
			rootEl = document.body;
		} else if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}

		const rootDelegate = new DomDelegate(rootEl);
		rootDelegate.on('click', handleClick);
		rootEl.setAttribute('data-o-share--js', '');

		oShare.rootDelegate = rootDelegate;
		oShare.rootEl = rootEl;

		if (rootEl.children.length === 0) {
			if (!config) {
				config = {};
				config.links = rootEl.hasAttribute('data-o-share-links') ? rootEl.getAttribute('data-o-share-links').split(' ') : fallbackConfig.links;
				config.url = rootEl.getAttribute('data-o-share-url') || fallbackConfig.url;
				config.title = rootEl.getAttribute('data-o-share-title') || fallbackConfig.title;
				config.summray = rootEl.getAttribute('data-o-share-summary') || fallbackConfig.summary;
			}
			render();
		}

		const initEvent = new CustomEvent('oShare.ready',
			{
				detail: {
					share: oShare
				},
				bubbles: true
			}
		);

		oShare.rootEl.dispatchEvent(initEvent);
	}

	function render() {
		const ulElement = document.createElement('ul');

		for (let i = 0; i < config.links.length; i++) {
			const link = config.links[i];
			const linkName = socialUrls[link].name;

			const liElement = document.createElement('li');
			liElement.classList.add('o-share__action', 'o-share__action--' + link)
			
			const aElement = document.createElement('a');
			aElement.href = generateSocialUrl(link);
			aElement.target = '_blank';
			
			const iElement = document.createElement('i');
			iElement.classList.add('o-icons__social-' + social);
			aElement.appendChild(iElement);

			const spanElement = document.createElement('span')		
			spanElement.innerHTML = socialName;			
			aElement.appendChild(spanElement);

			liElement.appendChild(aElement);
			ulElement.appendChild(liElement);
		}
		oShare.rootEl.appendChild(ulElement);
	}

	function generateSocialUrl (socialNetwork) {
		let templateUrl = socialUrls[socialNetwork].url;
		templateUrl = templateUrl.replace('{{url}}', encodeURIComponent(config.url))
			.replace('{{title}}', encodeURIComponent(config.title))
			.replace('{{summary}}', encodeURIComponent(config.summary));
		return templateUrl;
	}

	function handleClick(e) {
		const actionEl = e.target.closest('li.o-share__action');

		if (oShare.rootEl.contains(actionEl) && actionEl.querySelector('a[href]')) {
			e.preventDefault();

			const url = actionEl.querySelector('a[href]').href;

			const clickEvent = new CustomEvent('oTracking.event', {
				detail: {
					category: 'share',
					action: 'click',
					button: actionEl.textContent.trim();
				}
			});
			oShare.rootEl.dispatchEvent(clickEvent);

			if (actionEl.classList.contains('o-share__action--url')) {
				copyLink(url, actionEl);
			} else {
				shareSocial(url);
			}
		}
	}
}
var Share = {
	init: function(rootEl, socialList, config) {
		this.openWindows = {};

		var hasShareLinks = null;
		this.rootEl = rootEl;
		this.socials = socialList;
		this.config = config;
//If `socialList` and `config` were passed in the wrong order:
		for (var i = 1; i < arguments.length; i++) {
			if (Array.isArray(arguments[i])) {
				this.socials = arguments[i];
			} else {
				this.config = arguments[i];
			}
		}
		
		if (!(this.rootEl instanceof HTMLElement)) {
			this.rootEl = document.querySelector(rootEl);
		}

		if (!this.rootEl) {
			this.rootEl = document.body;
		} 

		this.rootEl.addEventListener('click', this.handleClick);

		this.rootEl.setAttribute('data-o-share--js', '');

//Try if there is a `data-o-share-links` attribute on the `rootEl`
		try {
			hasShareLinks = this.rootEl.hasAttribute('data-o-share-links');
			console.log('hasShareLinks: ', hasShareLinks)
		} catch(e) {
			console.log(e.message);
		}
//If there is `data-o-share-links`, then split the attribute value into an array...
		if (!this.socials && hasShareLinks) {
			this.socials = this.rootEl.getAttribute('data-o-share-links').split(' ') || [];
		}
//else, use `defaultNetworks`:
		if (!this.socials && !hasShareLinks) {
			this.socials = socialUrls.defaultSocialList;
		}
//If `config` param does not exist, get the share url content from tags.
		if (!this.config) {
			this.config = pageMeta;
		}
	},

	render: function() {
		var ulElement = document.createElement('ul');

		for (var i = 0; i < this.socials.length; i++) {
			var social = this.socials[i];
			var socialName = socialUrls[social].name;
			var url = this.generateSocialUrl(social);

			var liElement = document.createElement('li');
			liElement.classList.add('o-share__action', 'o-share__action--' + social)
			
			var aElement = document.createElement('a');
			aElement.href = url;
			aElement.target = '_blank';
			aElement.setAttribute('data-trackable', social)

			var iElement = document.createElement('i');
			iElement.classList.add('icon-social-' + social);

			var spanElement = document.createElement('span')
			
			spanElement.appendChild(document.createTextNode(socialName));

			aElement.appendChild(iElement);
			aElement.appendChild(spanElement);
			liElement.appendChild(aElement);
			ulElement.appendChild(liElement);
		}

		try {
			this.rootEl.appendChild(ulElement);
		} catch(e) {
			console.log(e.message);
		}
	},

	generateSocialUrl: function(social) {
		var templateUrl = socialUrls[social].url;
		templateUrl = templateUrl.replace('{{url}}', encodeURIComponent(this.config.url))
			.replace('{{title}}', encodeURIComponent(this.config.title))
			.replace('{{summary}}', encodeURIComponent(this.config.summary));
		return templateUrl;
	},

	dispathCustomEvent: function(event, data = {}, namespace = 'oShare') {
		this.rootEl.dispatchEvent(new CustomEvent(namespace + '.' + event, {
			detail: data,
			bubbles: true
		}));
	},

	handleClick: (ev) => {
		const actionEl = ev.target.closest('li.o-share__action');

		if (this.rootEl.contains(actionEl) && actionEl.querySelector('a[href')) {
			ev.preventDefault();

			const url = actionEl.querySelector('a[href]').href;

			this.dispatchEvent('event', {
				category: 'share',
				action: 'click',
				button: actionEl.textContent.trim()
			}, 'oTracking');

			if (actionEl.classList.contains('o-share__action--url')) {
				this.copyLink(url, actionEl);
			} else {
				this.shareSocial(url);
			}
		}
	},

	copyLink: function(url, parentEl) {
		if (!url || !parentEl || parentEl.hasAttribute("aria-selected")) {
			return;
		}
		parentEl.setAttribute('aria-selected', 'true');

		this.dispatchCustomEvent('open', {
			share: oShare,
			action: 'url',
			url: url
		});
	},

	shareSocial: function(url) {
		if (url) {
			if (this.openWindows[url] && !openWindows[url].closed) {
				openWindows[url].focus();
			} else {
				openWindows[url] = window.open(url, '', 'width=646,height=436');
			}

			dispatchEvent('open', {
				share: oShare,
				action: "social",
				url: url
			});
		}
	}
};

module.exports = Share;