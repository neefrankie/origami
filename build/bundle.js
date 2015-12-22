/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _share = __webpack_require__(1);

	__webpack_require__(2);

	var shareDiv = document.querySelector('.share-links');

	new _share.Share(shareDiv);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		defaultSocialList: ['wechat', 'weibo', 'linkedin']
	};

	var Share = (function () {
		function Share(rootEl, socialList, config) {
			_classCallCheck(this, Share);

			this.rootEl = rootEl;
			this.socials = socialList;
			this.config = config;
			//If `networks` and `config` were passed in the wrong order:
			for (var i = 1; i < arguments.length; i++) {
				if (Array.isArray(arguments[i])) {
					this.socials = arguments[i];
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
				var hasShareAttr = this.rootEl.hasAttribute('data-link-list');
			} catch (e) {
				console.log(e.message);
			}
			//If there is `data-o-share-links`, then split the attribute value into an array...
			if (!this.socials && hasShareAttr) {
				this.socials = this.rootEl.getAttribute('data-share-links').split(' ') || [];
			}
			//else, use `defaultNetworks`:
			if (!this.socials && !hasShareAttr) {
				this.socials = socialUrls.defaultSocialList;
			}
			//If `config` param does not exist, get the share url content from tags.
			if (!this.config) {
				this.config = {};
				this.config.url = window.location.href || '';
				this.config.title = this.getTitle();
				this.config.summary = this.getDescription();
			}
			this.render();
		}

		_createClass(Share, [{
			key: "render",
			value: function render() {
				var ulElement = document.createElement('ul');

				for (var i = 0; i < this.socials.length; i++) {
					var social = this.socials[i];
					var socialName = socialUrls[social].name;
					var url = this.generateSocialUrl(social);

					var liElement = document.createElement('li');

					var aElement = document.createElement('a');
					aElement.classList.add('share-link');
					aElement.classList.add('share-' + social);
					aElement.href = url;
					aElement.target = '_blank';

					var iElement = document.createElement('i');
					iElement.classList.add('icon-social-' + social);

					var spanElement = document.createElement('span');

					var socialText = document.createTextNode(socialName);
					spanElement.appendChild(socialText);

					aElement.appendChild(iElement);
					aElement.appendChild(spanElement);
					liElement.appendChild(aElement);
					ulElement.appendChild(liElement);
				}

				try {
					this.rootEl.appendChild(ulElement);
				} catch (e) {
					console.log(e.message);
				}
			}
		}, {
			key: "generateSocialUrl",
			value: function generateSocialUrl(social) {
				var templateUrl = socialUrls[social].url;
				templateUrl = templateUrl.replace('{{url}}', encodeURIComponent(this.config.url)).replace('{{title}}', encodeURIComponent(this.config.title)).replace('{{summary}}', encodeURIComponent(this.config.summary));
				return templateUrl;
			}
		}, {
			key: "getDescription",
			value: function getDescription() {
				var descElement = document.querySelector('meta[property="og:description"]');
				if (descElement) {
					return descElement.hasAttribute('content') ? descElement.getAttribute('content') : '';
				}
				return '';
			}
		}, {
			key: "getTitle",
			value: function getTitle() {
				var titleElement = document.querySelector('title');
				if (titleElement) {
					//`innerText` for IE
					var titleText = titleElement.textContent !== undefined ? titleElement.textContent : titleElement.innerText;
					return titleText.split('-')[0].trim();
				}
				return '';
			}
		}]);

		return Share;
	})();

	;

	exports.Share = Share;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".share-link i {\n  padding-left: 1em;\n  background-repeat: no-repeat;\n  background-position: left center;\n  background-size: contain;\n  border-radius: .2em; }\n\n.share-link span {\n  padding-left: .3em;\n  font-size: 18px; }\n\n.share-link:hover {\n  background-color: orange; }\n\n.no-bg .icon-social-wechat {\n  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20d%3D%22M28.956%209.17C-.56%2014.464-10.396%2047.946%2013.08%2063.27c1.29.832%201.29.74-.644%206.525L10.78%2074.75l5.946-3.2%205.946-3.2%203.155.77c3.31.83%207.54%201.414%2010.36%201.414h1.686l-.582-2.246C32.667%2051.175%2048.664%2034.22%2069.476%2034.22h2.82l-.584-2.03C67.143%2016.156%2047.865%205.79%2028.956%209.17zM26.38%2024.16c3.126%202.123%203.31%206.71.307%208.678-4.872%203.2-10.572-2.432-7.294-7.23%201.44-2.156%204.904-2.864%206.988-1.45zm25.133%200c5.15%203.478%201.287%2011.51-4.475%209.294-4.166-1.6-4.657-7.354-.765-9.416%201.533-.83%203.923-.77%205.24.122zm11.37%2012.68c-14.617%202.674-24.76%2013.815-24.18%2026.617.766%2017.14%2020.78%2028.957%2039.996%2023.665l2.264-.616%204.78%202.585c2.64%201.447%204.844%202.493%204.905%202.37.06-.154-.46-2-1.134-4.125-1.532-4.738-1.562-4.4.492-5.875%2023.107-16.65%202.817-50.072-27.126-44.626zm-.58%2013.815c1.287.862%201.962%203.016%201.41%204.585-1.166%203.356-6.164%203.602-7.51.37-1.534-3.724%202.696-7.17%206.1-4.954zm20.472.37c2.023%201.936%201.688%205.23-.675%206.46-3.616%201.847-7.416-1.845-5.546-5.384%201.225-2.277%204.382-2.83%206.22-1.077zM55.415%2084.27%22%20fill%3D%22%23609700%22%2F%3E%3C%2Fsvg%3E\"); }\n\n.no-bg .icon-social-weibo {\n  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Cpath%20d%3D%22M73.066%209.496c-1.704.03-3.407.222-5.083.58-2.07.44-3.38%202.484-2.94%204.54.442%202.07%202.472%203.38%204.54%202.937%206.362-1.352%2013.248.622%2017.91%205.796%204.665%205.172%205.933%2012.222%203.932%2018.403-.648%202.015.456%204.166%202.47%204.815%202.015.647%204.17-.457%204.818-2.457v-.01c2.814-8.678%201.033-18.6-5.535-25.87-5.336-5.92-12.73-8.86-20.112-8.734zm1.06%2013.604c-1.104-.05-2.215.04-3.3.276-1.78.372-2.913%202.138-2.54%203.918.386%201.78%202.14%202.913%203.906%202.527%202.125-.453%204.442.208%206%201.933%201.56%201.74%201.988%204.097%201.312%206.167-.552%201.724.388%203.586%202.126%204.152%201.74.552%203.587-.386%204.153-2.124%201.366-4.236.51-9.066-2.69-12.612-2.4-2.66-5.657-4.086-8.968-4.236z%22%20fill%3D%22%23f93%22%2F%3E%3Cpath%20d%3D%22M42.015%2084.568c-16.558%201.642-30.852-5.85-31.93-16.71C9.01%2056.99%2021.565%2046.86%2038.11%2045.22c16.558-1.642%2030.853%205.85%2031.915%2016.708%201.09%2010.872-11.465%2021.012-28.01%2022.64m33.102-36.08c-1.408-.428-2.374-.704-1.642-2.553%201.6-4.015%201.766-7.478.027-9.962-3.242-4.636-12.128-4.387-22.31-.124%200%200-3.202%201.392-2.374-1.133%201.56-5.036%201.324-9.244-1.104-11.687-5.52-5.53-20.214.208-32.812%2012.805C5.478%2045.26%200%2055.262%200%2063.913%200%2080.443%2021.208%2090.5%2041.946%2090.5c27.196%200%2045.285-15.797%2045.285-28.34.016-7.588-6.372-11.892-12.112-13.672%22%20fill%3D%22%23e6162d%22%2F%3E%3Cpath%20d%3D%22M7.354%2065.196c0%2011.645%2015.164%2021.083%2033.86%2021.083%2018.697%200%2033.86-9.44%2033.86-21.085%200-11.645-15.163-21.082-33.86-21.082-18.696%200-33.86%209.437-33.86%2021.082%22%20fill%3D%22%23fff%22%2F%3E%3Cpath%20d%3D%22M42.926%2064.893c-.58.993-1.863%201.462-2.856%201.048-.994-.4-1.297-1.515-.732-2.48.58-.967%201.808-1.436%202.788-1.05.993.36%201.352%201.477.8%202.484m-5.285%206.76c-1.6%202.553-5.034%203.67-7.614%202.498-2.54-1.158-3.298-4.125-1.698-6.622%201.587-2.483%204.9-3.587%207.465-2.51%202.594%201.117%203.422%204.055%201.85%206.636m6.015-18.075c-7.88-2.056-16.778%201.876-20.2%208.816-3.49%207.08-.11%2014.943%207.837%2017.51%208.25%202.662%2017.965-1.422%2021.346-9.052%203.34-7.478-.827-15.163-8.982-17.274%22%2F%3E%3C%2Fsvg%3E\"); }\n\n.no-bg .icon-social-linkedin {\n  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20d%3D%22M19.615%2010C14.3%2010%2010%2014.317%2010%2019.627c0%205.317%204.302%209.63%209.615%209.63%205.3%200%209.61-4.312%209.61-9.628%200-5.313-4.31-9.63-9.61-9.63zm50.497%2025.234c-8.065%200-13.474%204.43-15.69%208.63h-.22v-7.302H38.298V90h16.566V63.566c0-6.97%201.324-13.72%209.95-13.72%208.503%200%208.617%207.97%208.617%2014.167V90H90V60.688c0-14.386-3.097-25.455-19.888-25.455zm-58.79%201.33V90H27.9V36.563H11.32z%22%20fill%3D%22%230977b6%22%2F%3E%3C%2Fsvg%3E\"); }\n\n.with-bg .icon-social-wechat {\n  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20d%3D%22M10%200C4.46%200%200%204.46%200%2010v80c0%205.54%204.46%2010%2010%2010h80c5.54%200%2010-4.46%2010-10V10c0-5.54-4.46-10-10-10H10zm30.225%2020.973C51.72%2020.93%2062.4%2027.71%2065.197%2037.53l.408%201.423h-1.972c-14.57%200-25.768%2011.87-22.53%2023.848l.41%201.574H40.33c-1.973%200-4.933-.41-7.25-.99l-2.21-.537-4.16%202.24-4.163%202.238%201.158-3.467c1.353-4.05%201.353-3.986.45-4.568C7.723%2048.56%2014.61%2025.122%2035.27%2021.417v.002c1.654-.297%203.313-.44%204.955-.448zm-8.68%2010.423c-1.155.036-2.34.583-2.97%201.526-2.294%203.36%201.696%207.302%205.107%205.062%202.102-1.378%201.972-4.588-.215-6.074-.547-.37-1.23-.535-1.922-.514zm17.738.02c-.668-.016-1.354.117-1.89.408-2.725%201.444-2.382%205.472.535%206.592%204.033%201.55%206.738-4.072%203.133-6.506-.46-.312-1.11-.478-1.776-.494zm13.582%208.963c18.772-.53%2030.308%2020.714%2015.143%2031.64-1.438%201.033-1.417.796-.344%204.112.473%201.487.835%202.78.79%202.888-.042.088-1.584-.645-3.43-1.66l-3.348-1.807-1.586.43C56.638%2079.69%2042.628%2071.418%2042.092%2059.42c-.407-8.962%206.694-16.76%2016.928-18.633v-.002c1.31-.238%202.594-.37%203.845-.404zm-6.076%209.6c-1.79.144-3.254%201.99-2.45%203.945.944%202.262%204.443%202.09%205.26-.26.386-1.098-.086-2.605-.988-3.21h-.002c-.594-.387-1.225-.526-1.82-.477zm14.436.013c-1.038-.046-2.103.478-2.64%201.475-1.308%202.476%201.352%205.06%203.884%203.768%201.654-.86%201.89-3.167.473-4.523-.482-.46-1.094-.693-1.716-.72z%22%20fill%3D%22%23609700%22%2F%3E%3C%2Fsvg%3E\"); }\n\n.with-bg .icon-social-weibo {\n  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Cpath%20d%3D%22M10%200C4.46%200%200%204.46%200%2010v80c0%205.54%204.46%2010%2010%2010h80c5.54%200%2010-4.46%2010-10V10c0-5.54-4.46-10-10-10H10zm56.146%2021.646c5.167-.088%2010.343%201.968%2014.08%206.112%204.596%205.09%205.844%2012.036%203.874%2018.11v.01c-.454%201.4-1.96%202.174-3.37%201.72-1.412-.454-2.186-1.96-1.732-3.37%201.4-4.328.513-9.264-2.752-12.886-3.265-3.622-8.084-5.003-12.537-4.057-1.45.31-2.87-.608-3.18-2.056-.31-1.44.61-2.87%202.057-3.18%201.173-.25%202.366-.384%203.558-.405zm-21.724%208c1.645.03%203.013.507%203.978%201.475%201.7%201.71%201.863%204.656.772%208.18-.58%201.77%201.662.795%201.662.795%207.128-2.985%2013.347-3.16%2015.617.086%201.22%201.74%201.105%204.163-.015%206.973-.512%201.295.163%201.488%201.148%201.787%204.018%201.245%208.49%204.26%208.48%209.572%200%208.78-12.66%2019.838-31.7%2019.838C29.847%2078.35%2015%2071.31%2015%2059.738c0-6.055%203.835-13.057%2010.432-19.654%206.613-6.614%2014.054-10.528%2018.99-10.438zm22.467%201.522c2.315.105%204.594%201.103%206.275%202.965%202.24%202.482%202.84%205.865%201.883%208.83-.397%201.217-1.69%201.873-2.907%201.486-1.216-.398-1.876-1.703-1.49-2.91.474-1.45.176-3.1-.916-4.316-1.09-1.208-2.713-1.67-4.2-1.352-1.237.27-2.465-.524-2.735-1.77-.26-1.245.53-2.48%201.777-2.742.76-.163%201.538-.227%202.31-.192zm-23.04%2014.71c-13.088%200-23.704%206.607-23.704%2014.76%200%208.15%2010.616%2014.757%2023.704%2014.757%2013.087%200%2023.7-6.607%2023.7-14.758%200-8.152-10.613-14.758-23.7-14.758zm-1.44%206.245c1.054-.01%202.114.11%203.15.38%205.707%201.48%208.623%206.858%206.286%2012.093-2.367%205.34-9.166%208.2-14.942%206.336-5.563-1.797-7.93-7.3-5.486-12.256%201.946-3.947%206.423-6.505%2010.992-6.553zm1.54%206.467c-.55.01-1.11.323-1.415.83-.396.676-.184%201.458.512%201.738.694.29%201.593-.04%202-.734.385-.705.134-1.487-.562-1.738-.17-.068-.353-.1-.537-.096zm-5.315%201.633c-1.462-.02-2.974.74-3.807%202.045-1.12%201.748-.59%203.825%201.188%204.636%201.806.82%204.21.04%205.332-1.748%201.1-1.806.52-3.864-1.295-4.646-.45-.19-.93-.28-1.418-.287z%22%20fill%3D%22%23e6162d%22%2F%3E%3C%2Fsvg%3E\"); }\n\n.with-bg .icon-social-linkedin {\n  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20d%3D%22M10%200C4.46%200%200%204.46%200%2010v80c0%205.54%204.46%2010%2010%2010h80c5.54%200%2010-4.46%2010-10V10c0-5.54-4.46-10-10-10H10zm17.21%2020h.003c3.974%200%207.205%203.238%207.205%207.22%200%203.988-3.232%207.223-7.207%207.223-3.983%200-7.21-3.235-7.21-7.222%200-3.98%203.225-7.22%207.21-7.22zm37.874%2018.926c12.593%200%2014.916%208.3%2014.916%2019.09V80H67.574V60.51c0-4.648-.086-10.625-6.463-10.625-6.467%200-7.46%205.062-7.46%2010.29V80H41.226V39.922H53.15v5.476h.166c1.662-3.15%205.72-6.472%2011.768-6.472zm-44.094.996h12.436V80H20.99V39.922z%22%20fill%3D%22%230977b6%22%2F%3E%3C%2Fsvg%3E\"); }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);