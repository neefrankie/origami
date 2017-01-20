import setDefault from './src/js/set-default.js';
import generateHtml from './src/js/generateHtml.js';

function getOgContent(metaEl) {
  if (!(metaEl instanceof HTMLElement)) {
    metaEl = document.querySelector(metaEl);
  }
  return metaEl.hasAttribute('content') ? metaEl.getAttribute('content') : '';
}

// Get page meta content statically. Should not put this inside the `Share` object in order to reduce DOM traverse.
const shareConfigFallback = {
  url: encodeURIComponent(window.location.href),
  summary: encodeURIComponent(getOgContent('meta[property="og:description"]')),
  title: encodeURIComponent(getOgContent('meta[property="og:title"]')),
  sprite: false
};

/*
 * @param {String | HTMLElement} rootEl - required
 * @config {Object} config - optional
 * @config {String} config.url - URL of the shared page.
 * @config {String} config.summary - Story summary
 * @config {String} config.title - Page title
 * @config {Boolean | String} config.sprite - Use svg sprite in HTML tag. `true` to use default URL. `String` to customize the sprite file URL. Default `false`
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
      Array.prototype.forEach.call(rootEl.attributes, function (attr) {
        if (attr.name.indexOf('data-o-share') === 0) {
          const key = attr.name.replace('data-o-share-', '');
          config[key] = encodeURIComponent(attr.value);
        }
      });
    }

    this.rootEl = rootEl;
    this.config = setDefault(config).to(shareConfigFallback);
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