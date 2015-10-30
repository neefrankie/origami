var socialUrls = {
	wechat: {
		name: "微信",
		url: "http://www.ftchinese.com/m/corp/qrshare.html?title={{title}}&url={{url}}&ccode=2C1A1408"
	},
	weibo: {
		name: "微博",
		url: "http://service.weibo.com/share/share.php?&appkey=4221537403&url={{url}}&title=【{{title}}】{{summary}}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&searchPic=false&ccode=2G139005"
	},
	linkedin: {
		name: "LinkedIn",
		url: "http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{summary}}&source=FT中文网"
	},
	defaultNetworks: ['wechat', 'weibo', 'linkedin']
};

/*
  *@object Share used as prototype
  */
var Share = {
	init: function(rootEl, networks, config) {
		this.rootEl = rootEl;
		this.networks = networks;
		this.config = config;
//If `networks` and `config` were passed in the wrong order:
		for (var i = 1; i < arguments.length; i++) {
			if (Array.isArray(arguments[i])) {
				this.networks = arguments[i];
			} else {
				this.config = arguments[i];
			}
		}
		if (!this.rootEl) {
			this.rootEl = document.body;
		} 
		if (!(this.rootEl instanceof HTMLElement)) {
			this.rootEl = document.querySelector(rootEl);
		}
//Try if there is a `data-o-share-links` attribute on the `rootEl`
		try {
			var hasShareAttr = this.rootEl.hasAttribute('data-o-share-links');
		} catch(e) {
			console.log(e.message);
		}
//If there is `data-o-share-links`, then split the attribute value into an array...
		if (!this.networks && hasShareAttr) {
			this.networks = this.rootEl.getAttribute('data-o-share-links').split(' ') || [];
		}
//else, use `defaultNetworks`:
		if (!this.networks && !hasShareAttr) {
			this.networks = socialUrls.defaultNetworks;
		}
//If `config` param does not exist, get the share url content from tags.
		if (!this.config) {
			this.config = {};
			this.config.url = window.location.href || '';
			this.config.title = document.getElementsByTagName('title')[0].firstChild.nodeValue || '';
			this.config.summary = this.getDescription();
		}
		this.render();
	},

	render: function() {
		var ulElement = document.createElement('ul');

		for (var i = 0; i < this.networks.length; i++) {
			var network = this.networks[i];
			var name = socialUrls[network].name;
			var url = this.generateSocialUrl(network);

			var liElement = document.createElement('li');
			

			var aElement = document.createElement('a');
			aElement.classList.add('share-link');
			aElement.classList.add('share-link-' + network);
			aElement.href = url;
			aElement.target = '_blank';		
			
			var aText = document.createTextNode(name);
			aElement.appendChild(aText);
			liElement.appendChild(aElement);
			ulElement.appendChild(liElement);
		}

		try {
			this.rootEl.appendChild(ulElement);
		} catch(e) {
			console.log(e.message);
		}
	},

	generateSocialUrl: function(socialNetwork) {
		var templateUrl = socialUrls[socialNetwork].url;
		templateUrl = templateUrl.replace('{{url}}', encodeURIComponent(this.config.url))
			.replace('{{title}}', encodeURIComponent(this.config.title))
			.replace('{{summary}}', encodeURIComponent(this.config.summary));
		return templateUrl;
	},

	getDescription: function() {
		var descElement = document.querySelector('meta[property="og:description"]');
		if (descElement) {
			return descElement.hasAttribute('content') ? descElement.getAttribute('content') : '';
		}	
	}
};
