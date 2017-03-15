/** 
  * Class representing a toggle element
  */
var Toggle = function Toggle(toggleEl, config) {
  if (!toggleEl) {
    return;
  } else if (!(toggleEl instanceof HTMLElement)) {
    toggleEl = document.querySelector(toggleEl);
  }

  if (!config) {
    config = {};

    for (var i = 0; i < toggleEl.attributes.length; i++) {
      var attr = toggleEl.attributes[i];
      if (attr.name.indexOf('data-o-toggle') === 0) {
        var key = attr.name.replace('data-o-toggle-', '');
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
  this.toggleEl.setAttribute('aria-expanded', this.state);
  this.toggle = this.toggle.bind(this);
  this.toggleEl.addEventListener('click', this.toggle);
  this.toggleEl.setAttribute('data-o-toggle--js', 'true');
};

Toggle.prototype.toggle = function toggle (e) {
  /** 
  * `toggle` adds the class name and returns true if it not exists; returns false if it exists then removes it.
  * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList}
  */
  this.state = this.targetEl.classList.toggle('o-toggle--active');
  this.toggleEl.setAttribute('aria-expanded', this.state);
  this.targetEl.setAttribute('aria-hidden', !this.state);

  e && e.preventDefault();
  this.callback && this.callback(this.state ? 'open' : 'close', e, this.targetEl);
};

Toggle.prototype.destroy = function destroy () {
  this.toggleEl.removeEventListener('click', this.toggle);
  this.toggleEl.removeAttribute('aria-expanded');
  this.targetEl.removeAttribute('aria-hidden');
  this.targetEl = undefined;
  this.toggleEl = undefined;
};

Toggle.init = function init (el, config) {
  if (!el) {
    el = document.body;
  } else if (!(el instanceof HTMLElement)) {
    el = document.querySelector(el);
  }

  var toggleEls = el.querySelectorAll('[data-o-component="o-toggle"]');
  var toggles = [];

  for (var i = 0; i < toggleEls.length; i++) {
    var toggleEl = toggleEls[i];
    if (!toggleEl.hasAttribute('data-o-toggle--js')) {
      toggles.push(new Toggle(toggleEl, config));
    }
  }

  return toggles;
};

/** 
	* Class representing a togglable menu
	* @extends Toggle
	*/
var ToggleMenu = (function (Toggle$$1) {
  function ToggleMenu(rootEl, config) {
    if (!rootEl) {
      return;
    } else if (!(rootEl instanceof HTMLElement)) {
      rootEl = document.querySelector(rootEl);
    }

    var toggleEl = rootEl.querySelector('[data-o-component="o-toggle"]');

    var targetEl = null;

    config = config ? config : {};

    if (!config.target) {
    	targetEl = toggleEl.hasAttribute('data-o-toggle-target') ? toggleEl.getAttribute('data-o-toggle-target') : null;
    } else {
    	targetEl = config.target;
    }
    
    if (!targetEl) {return;}

    // At this point config.target could be either a String or an HTMLElement. Make sure it's an HTMLElement.
    if (!(targetEl instanceof HTMLElement)) {
    	targetEl = rootEl.querySelector(targetEl);
    }

    Toggle$$1.call(this, toggleEl, {target: targetEl});

		// 'this' is not allowed before super()
		this.rootEl = rootEl;
		this.anchorClassName = config.autoCollapseAnchor;

		// Bind `this` to current object even in callback.
    this.clickOnHash = this.clickOnHash.bind(this);
    this.clickOnBody = this.clickOnBody.bind(this);
    this.handleEsc = this.handleEsc.bind(this);

    if (config.hashNavClass) {
    	targetEl.addEventListener('click', this.clickOnHash);
    }

    if (config.bodyTogglable) {
    	document.body.addEventListener('click', this.clickOnBody);
    }
    
    document.body.addEventListener('keydown', this.handleEsc);
	}

  if ( Toggle$$1 ) ToggleMenu.__proto__ = Toggle$$1;
  ToggleMenu.prototype = Object.create( Toggle$$1 && Toggle$$1.prototype );
  ToggleMenu.prototype.constructor = ToggleMenu;

	// `toggle()` inherited from `Toggle`.
  ToggleMenu.prototype.clickOnHash = function clickOnHash (e) {
    if (this.state && e.target.classList.contains(this.anchorClassName)) {
    // do not pass `e` to `toggle()`. You centainly do not want a link prevented.
      this.toggle();
    }
  };

	ToggleMenu.prototype.clickOnBody = function clickOnBody (e) {
		if (this.state && !this.rootEl.contains(e.target)) {
      this.toggle();
    }
	};

	ToggleMenu.prototype.handleEsc = function handleEsc (e) {
    if (this.state && e.keyCode === 27) {
        this.toggle();
    }
  };

  return ToggleMenu;
}(Toggle));

export { ToggleMenu };export default Toggle;
