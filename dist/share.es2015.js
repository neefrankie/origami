function getSocials() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$url = _ref.url,
        url = _ref$url === undefined ? '{{share.url}}' : _ref$url,
        _ref$title = _ref.title,
        title = _ref$title === undefined ? '{{share.title}}' : _ref$title,
        _ref$summary = _ref.summary,
        summary = _ref$summary === undefined ? '{{share.summary}}' : _ref$summary,
        _ref$links = _ref.links,
        links = _ref$links === undefined ? [] : _ref$links,
        _ref$encode = _ref.encode,
        encode = _ref$encode === undefined ? true : _ref$encode;

    if (encode) {
        url = encodeURIComponent(url);
        title = encodeURIComponent(title);
        summary = encodeURIComponent(summary);
    }
    return [{
        name: "wechat",
        text: "微信",
        url: 'http://www.ftchinese.com/m/corp/qrshare.html?title=' + title + '&url=' + url + '&ccode=2C1A1408'
    }, { name: "weibo",
        text: "微博",
        url: 'http://service.weibo.com/share/share.php?&appkey=4221537403&url=' + url + '&title=\u3010' + title + '\u3011' + summary + '&ralateUid=1698233740&source=FT\u4E2D\u6587\u7F51&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005'
    }, {
        name: "linkedin",
        text: "领英",
        url: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title + '&summary=' + summary + '&source=FT\u4E2D\u6587\u7F51'
    }, {
        name: "facebook",
        text: "Facebook",
        url: 'http://www.facebook.com/sharer.php?u=' + url
    }, {
        name: "twitter",
        text: "Twitter",
        url: 'https://twitter.com/intent/tweet?url=' + url + '&amp;text=\u3010' + title + '\u3011' + summary + '&amp;via=FTChinese'
    }].filter(function (social) {
        return links.indexOf(social.name) > -1;
    });
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfig = {
  url: window.location.href || '',
  summary: getOgContent('meta[property="og:description"]'),
  title: getOgContent('meta[property="og:title"]'),
  links: ['wechat', 'weibo', 'linkedin', 'facebook', 'twitter']
};

function getOgContent(metaEl) {
  if (!(metaEl instanceof HTMLElement)) {
    metaEl = document.querySelector(metaEl);
  }
  return metaEl.hasAttribute('content') ? metaEl.getAttribute('content') : '';
}

/*
 * @param {String | HTMLElement} rootEl - required
 * @config {Object} config - optional
 * @config {String} config.url - URL of the shared page.
 * @config {String} config.summary - Story summary
 * @config {String} config.title - Page title
 * @config {Array} config.links - Optional. Determin which social platform to show. null for all. 
 */

var Share = function () {
  function Share(rootEl, config) {
    _classCallCheck(this, Share);

    if (!rootEl) {
      rootEl = document.body;
    } else if (!(rootEl instanceof HTMLElement)) {
      rootEl = document.querySelector(rootEl);
    }

    if (!config) {
      config = {};
      var _defaultConfig = gatherConfig();
      config.links = rootEl.hasAttribute('data-o-share-links') ? rootEl.getAttribute('data-o-share-links').split(' ') : _defaultConfig.links;
      config.url = rootEl.getAttribute('data-o-share-url') || _defaultConfig.url;
      config.title = rootEl.getAttribute('data-o-share-title') || _defaultConfig.title;
      config.summary = rootEl.getAttribute('data-o-share-summary') || _defaultConfig.summary;
    }
    this.config = config;
    this.rootEl = rootEl;
    this.openWindows = {};

    if (rootEl.children.length === 0) {
      this.handleClick = this.handleClick.bind(this);
      this.render();
      this.rootEl.addEventListener('click', this.handleClick);
      this.rootEl.setAttribute('data-o-share--js', '');
    }
  }

  _createClass(Share, [{
    key: 'render',
    value: function render() {
      var socials = getSocials(this.config);
      var ulElement = document.createElement('ul');
      socials.forEach(function (social) {
        var liElement = document.createElement('li');
        liElement.classList.add('o-share__action', 'o-share__' + social.name);

        var aElement = document.createElement('a');
        aElement.href = social.url;
        aElement.setAttribute('target', '_blank');
        aElement.setAttribute('title', '\u5206\u4EAB\u5230' + social.text);

        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
      });
      this.rootEl.appendChild(ulElement);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      var target = e.target;
      e.preventDefault();
      while (target.nodeName !== 'A') {
        target = target.parentNode;
      }
      this.shareSocial(target.href);
    }
  }, {
    key: 'shareSocial',
    value: function shareSocial(url) {
      if (url) {
        if (this.openWindows[url] && !this.openWindows[url].closed) {
          this.openWindows[url].focus();
        } else {
          this.openWindows[url] = window.open(url, '', 'width=646,height=436');
        }
      }
    }
  }], [{
    key: 'init',
    value: function init(el) {
      var shareInstances = [];

      if (!el) {
        el = document.body;
      } else if (!el instanceof HTMLElement) {
        el = document.querySelector(el);
      }

      var shareElements = el.querySelectorAll('[data-o-component=o-share]');

      for (var i = 0; i < shareElements.length; i++) {
        shareInstances.push(new Share(shareElements[i]));
      }

      return shareInstances;
    }
  }]);

  return Share;
}();

export default Share;
