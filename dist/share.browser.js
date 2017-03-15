var Share = (function () {
'use strict';

function getSocials(config) {
  return [
    {
        name: "wechat",
        text: "微信",
        url: ("http://www.ftchinese.com/m/corp/qrshare.html?title=" + (config.title) + "&url=" + (config.url) + "&ccode=2C1A1408")
    },
    {name: "weibo",
        text: "微博",
        url: ("http://service.weibo.com/share/share.php?&appkey=4221537403&url=" + (config.url) + "&title=【" + (config.title) + "】" + (config.summary) + "&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005")
    },
    {
        name: "linkedin",
        text: "领英",
        url: ("http://www.linkedin.com/shareArticle?mini=true&url=" + (config.url) + "&title=" + (config.title) + "&summary=" + (config.summary) + "&source=FT中文网")
    },
    {
        name: "facebook",
        text: "Facebook",
        url: ("http://www.facebook.com/sharer.php?u=" + (config.url))
    },
    {
        name: "twitter",
        text: "Twitter",
        url: ("https://twitter.com/intent/tweet?url=" + (config.url) + "&amp;text=【" + (config.title) + "】" + (config.summary) + "&amp;via=FTChinese")
    }
  ].filter(function (social) {
    return config.links.indexOf(social.name) > -1
  });
}

var defaultConfig =  {
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
var Share = function Share(rootEl, config) {
  if (!rootEl) {
    rootEl = document.body;
  } else if (!(rootEl instanceof HTMLElement)) {
    rootEl = document.querySelector(rootEl);
  }

  if (!config) {
    config = {};
    config.links = rootEl.hasAttribute('data-o-share-links') ?
					rootEl.getAttribute('data-o-share-links').split(' ') : defaultConfig.links;
    config.url = rootEl.getAttribute('data-o-share-url') || defaultConfig.url;
    config.title = rootEl.getAttribute('data-o-share-title') || defaultConfig.title;
    config.summary = rootEl.getAttribute('data-o-share-summary') || defaultConfig.summary;
  }

  for (var k in config) {
    if (!config.hasOwnProperty(k)) {
      continue;
    }
    if (typeof config[k] !== 'string') {
      continue;
    }
    config[k] = encodeURIComponent(config[k]);
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
};

Share.prototype.render = function render () {
  var socials = getSocials(this.config);
  var ulElement = document.createElement('ul');
  socials.forEach(function (social) {
    var liElement = document.createElement('li');
    liElement.classList.add('o-share__action', ("o-share__" + (social.name)));
      
    var aElement = document.createElement('a');
    aElement.href = social.url;
    aElement.setAttribute('target', '_blank');
    aElement.setAttribute('title', ("分享到" + (social.text)));

    var iElement = document.createElement('i');
    iElement.textContent = social.text;

    aElement.appendChild(iElement);

    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);
  });
  this.rootEl.appendChild(ulElement);
};

Share.prototype.handleClick = function handleClick (e) {
  var target = e.target;
  e.preventDefault();
  while (target.nodeName !== 'A') {
    target = target.parentNode;
  }
  this.shareSocial(target.href);
};

Share.prototype.shareSocial = function shareSocial (url) {
  if (url) {
    if (this.openWindows[url] && !this.openWindows[url].closed) {
      this.openWindows[url].focus();
    } else {
      this.openWindows[url] = window.open(url, '', 'width=646,height=436');
    }
  }
};

Share.init = function init (el) {
  var shareInstances = [];

  if (!el) {
    el =document.body;
  } else if (!el instanceof HTMLElement) {
    el = document.querySelector(el);
  }

  var shareElements = el.querySelectorAll('[data-o-component=o-share]');

  for (var i = 0; i < shareElements.length; i++) {
    shareInstances.push(new Share(shareElements[i]));

  }

  return shareInstances;
};

return Share;

}());
