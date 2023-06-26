/**
 * @desc In this version `Share` only handles click event. Previously it dynamically generate all the DOM needed. But I don't think it's a good idea since it's much easy to staticlly build the HTML.
 * @param {String | HTMLElement} rootEl - required
 */
class Share {
  constructor(rootEl) {
    if (!rootEl) {
      rootEl = document.body;
    } else if (!(rootEl instanceof HTMLElement)) {
      rootEl = document.querySelector(rootEl);
    }
    
    this.rootEl = rootEl;
    this.openWindows = {};

    this.rootEl.addEventListener('click', this.handleClick.bind(this));
    this.rootEl.setAttribute('data-o-share--js', '');
  }

  handleClick(e) {
    let target = e.target;
    e.preventDefault();
    while (!target.classList.contains('o-share__icon')) {
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