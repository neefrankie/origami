'use strict';

const socials = [
  {
    name: "wechat",
    text: "微信",
    url: `http://www.ftchinese.com/m/corp/qrshare.html?title={{title}}&url={{url}}&ccode=2C1A1408`
  },
  {name: "weibo",
    text: "微博",
    url: `http://service.weibo.com/share/share.php?&appkey=4221537403&url={{url}}&title=【{{title}}】{{summary}}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005`
  },
  {
    name: "linkedin",
    text: "领英",
    url: `http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{summary}}&source=FT中文网`
  },
  {
    name: "facebook",
    text: "Facebook",
    url: `http://www.facebook.com/sharer.php?u={{url}}`
  },
  {
    name: "twitter",
    text: "Twitter",
    url: `https://twitter.com/intent/tweet?url={{url}}&amp;text=【{{title}}】{{summary}}&amp;via=FTChinese`
  }
];

function getOgContent(metaEl) {
  if (!(metaEl instanceof HTMLElement)) {
    metaEl = document.querySelector(metaEl);
  }
  return metaEl.hasAttribute('content') ? metaEl.getAttribute('content') : '';
}

function gatherConfig() {
  return {
    url: window.location.href || '',
    summary: getOgContent('meta[property="og:description"]') || '',
    title: getOgContent('meta[property="og:title"]') || '',
    links: socials.map(function(social) {
      return social.name
    })
  };
}

/*
 * @param {String | HTMLElement} rootEl - required
 * @config {Object} config - optional
 * @config {String} config.url - URL of the shared page.
 * @config {String} config.summary - Story summary
 * @config {String} config.title - Page title
 * @config {Array} config.links - Optional. Determin which social platform to show. null for all. 
 */
class Share {
  constructor(rootEl, config) {
    if (!rootEl) {
      rootEl = document.body;
    } else if (!(rootEl instanceof HTMLElement)) {
      rootEl = document.querySelector(rootEl);
    }

    if (!config) {
      config = {};
      const defaultConfig = gatherConfig();
      config.links = rootEl.hasAttribute('data-o-share-links') ?
					rootEl.getAttribute('data-o-share-links').split(' ') : defaultConfig.links;
      config.url = rootEl.getAttribute('data-o-share-url') || defaultConfig.url;
      config.title = rootEl.getAttribute('data-o-share-title') || defaultConfig.title;
      config.summary = rootEl.getAttribute('data-o-share-summary') || defaultConfig.summary;
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

  render() {
    const ulElement = document.createElement('ul');
    socials.filter((social) => {
      return this.config.links.indexOf(social.name) > -1
    }).forEach((social) => {
      const liElement = document.createElement('li');
      liElement.classList.add('o-share__action', `o-share__${social.name}`);
      const aElement = document.createElement('a');
      aElement.href = social.url.replace('{{url}}', this.config.url)
        .replace('{{title}}', encodeURIComponent(this.config.title))
        .replace('{{summary}}', encodeURIComponent(this.config.summary));
      aElement.setAttribute('target', '_blank');
      aElement.setAttribute('title', `分享到${social.text}`);
      liElement.appendChild(aElement);
      ulElement.appendChild(liElement);
    });
    this.rootEl.appendChild(ulElement);
  }

  handleClick(e) {
    let target = e.target;
    e.preventDefault();
    while (target.nodeName !== 'A') {
      target = target.parentNode;
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

module.exports = Share;
