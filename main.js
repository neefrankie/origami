import getSocials from './src/js/get-socials.js';

const defaultConfig =  {
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

    for (const k in config) {
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
  }

  render() {
    const socials = getSocials(this.config);
    const ulElement = document.createElement('ul');
    socials.forEach(social => {
      const liElement = document.createElement('li');
      liElement.classList.add('o-share__action', `o-share__${social.name}`);
      
      const aElement = document.createElement('a');
      aElement.href = social.url;
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