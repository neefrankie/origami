/** 
  * Class representing a toggle element
  */
class Toggle {
/**
  * Create a toggle instance
  * @param {String | HTMLElement} toggleEl - The toggle button
  * @param {Object} config
  * @param {String | HTMLElement} config.target - Toggle target. If not present, it will try to use `data-o-toggle-target` attribute on the `toggleEl`
  */
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
    this.state = false;

    this.callback = config.callback;
    if (typeof this.callback === 'string') {
      this.callback = new Function(this.callback);
    }

    this.targetEl = config.target;
    if (!(this.targetEl instanceof HTMLElement)) {
      this.targetEl = document.querySelector(this.targetEl);
    }
    this.targetEl.setAttribute('aria-hidden', !this.state);

    this.toggleEl = toggleEl;
    this.toggleEl.setAttribute('aria-expanded', this.state)
    this.toggle = this.toggle.bind(this);
    this.toggleEl.addEventListener('click', this.toggle);
    this.toggleEl.setAttribute('data-o-toggle--js', 'true');
  }

  toggle(e) {
    /** 
    * `toggle` adds the class name and returns true if it not exists; returns false if it exists then removes it.
    * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList}
    */
    this.state = this.targetEl.classList.toggle('o-toggle--active');
    this.toggleEl.setAttribute('aria-expanded', this.state);
    this.targetEl.setAttribute('aria-hidden', !this.state);

    e && e.preventDefault();
    this.callback && this.callback(this.state ? 'open' : 'close', e, this.targetEl);
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

    for (let i = 0; i < toggleEls.length; i++) {
      const toggleEl = toggleEls[i];
      if (!toggleEl.hasAttribute('data-o-toggle--js')) {
        toggles.push(new Toggle(toggleEl, config));
      }
    }

    return toggles;
  }
};

export default Toggle;
