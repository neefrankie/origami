const DomDelegate = require('dom-delegate');

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
		name: "领英",
		url: "http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{summary}}&source=FT中文网"
	},
	facebook: {
		name: "Facebook",
		url: "http://www.facebook.com/sharer.php?u={{url}}"
	},
	twitter: {
		name: "Twitter",
		url: "https://twitter.com/intent/tweet?url={{url}}&amp;text={{title}}&amp;via=FTChinese"
	}
};

// Get page meta content statically. Should not put this inside the `Share` object in order to reduce DOM traverse.
const fallbackConfig = {
	links: ['wechat', 'weibo', 'linkedin', 'facebook', 'twitter'],

	url: window.location.href || '',
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
		//rootEl.addEventListener('click', handleClick);
		rootDelegate.on('click', 'a', handleClick);
		rootEl.setAttribute('data-o-share--js', '');

		oShare.rootDomDelegate = rootDelegate;
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
	}

	function render() {
		const ulElement = document.createElement('ul');

		for (let i = 0; i < config.links.length; i++) {
			const link = config.links[i];
			const linkName = socialUrls[link].name;
			
			const liElement = document.createElement('li');
			//liElement.classList.add('o-share__action', 'o-share__' + link);
			liElement.className = 'o-share__action o-share__' + link;
			
			const aElement = document.createElement('a');

			aElement.href = generateSocialUrl(link);
			aElement.setAttribute('title', '分享到'+linkName);
			aElement.setAttribute('target', '_blank');
			
			const iElement = document.createElement('i');
			iElement.innerHTML = linkName;
			aElement.appendChild(iElement);

			liElement.appendChild(aElement);
			ulElement.appendChild(liElement);
		}
		oShare.rootEl.appendChild(ulElement);
	}

	function handleClick(e, target) {
		e.preventDefault();
		shareSocial(target.href);
	}

	function shareSocial(url) {
		if (url) {
			if (openWindows[url] && !openWindows[url].closed) {
				openWindows[url].focus();
			} else {
				openWindows[url] = window.open(url, '', 'width=646,height=436');
			}
		}
	}

	function generateSocialUrl (socialNetwork) {
		let templateUrl = socialUrls[socialNetwork].url;
		templateUrl = templateUrl.replace('{{url}}', encodeURIComponent(config.url))
			.replace('{{title}}', encodeURIComponent(config.title))
			.replace('{{summary}}', encodeURIComponent(config.summary));
		
		return templateUrl;
	}

	init();
}

Share.prototype.destroy = function() {
	this.rootDomDelegate.destroy();

	for (let i = 0; i < this.rootEl.children; i++) {
		this.rootEl.removeChild(this.rootEl.chidlren[i]);
	}

	this.rootEl.removeAttribute('data-o-share--js');
	this.rootEl = undefined;
};

Share.init = function(el) {
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
};

module.exports = Share;