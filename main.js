class Toggle {
  constructor(toggleEl, config) {
    if (!toggleEl) {
      return;
    } else if (!(toggleEl instanceof HTMLElement)) {
      toggleEl = document.querySelector(toggleEl);
    }

    if (!config) {
      config = {};

      for (let i = 0; i < toggleEl.attributes.length; i++) {
        const attr = toggleEl.attributes[i];
        if (attr.name.indexOf('data-o-toggle') === 0) {
          const key = attr.name.replace('data-o-toggle-', '');
          try {
            config[key] = JSON.parse(attr.value.replace(/\'/g, '"'));
          } catch (e) {
            config[key] = attr.value;
          }
        }
      }
    }

    this.targetEl = config.target;

    if (!(this.targetEl instanceof HTMLElement)) {
      this.targetEl = document.querySelector(this.targetEl);
    }
    this.targetEl.setAttribute('aria-hidden', 'true');

    this.toggleEl = toggleEl;
    this.toggleEl.setAttribute('aria-expanded', 'false')
    this.toggle = this.toggle.bind(this);
    this.toggleEl.addEventListener('click', this.toggle);
    this.toggleEl.setAttribute('data-o-toggle--js', 'true');
  }

  toggle(e) {
    e && e.preventDefault();
    const state = this.targetEl.classList.toggle('o-toggle--active');
    this.toggleEl.setAttribute('aria-expanded', state);
    this.targetEl.setAttribute('aria-hidden', !state);
  }

  destroy() {
    this.toggleEl.removeEventListener('click', this.toggle);
    this.toggleEl.removeAttribute('aria-expanded');
    this.targetEl.removeAttribute('aria-hidden');
    this.targetEl = undefined;
    this.toggleEl = undefined;
  }

  static init(el, config) {
    if (!el) {
      el = document.body;
    } else if (!(el instanceof HTMLElement)) {
      el = document.querySelector(el);
    }

    const toggleEls = el.querySelectorAll('[data-o-component="o-toggle"]');
    const toggles = [];

    for (let toggleEl of toggleEls) {
      if (!toggleEl.hasAttribute('data-o-toggle--js')) {
        toggles.push(new Toggle(toggleEl, config));
      }
    }
    console.log(toggles);
    return toggles;
  }
};

export default Toggle;
