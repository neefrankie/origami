import Toggle from './toggle';
/** 
	* Class representing a togglable menu
	* @extends Toggle
	*/
class ToggleMenu extends Toggle {
	/**
	 * Create a toggle menu
	 * @param {String | HTMLElement} rootEl - The memnu container
	 * @param {Object} config
	 * @param {String | HTMLElement} config.target - Toggle target. Passed to `Toggle` constructor.
	 * @param {Boolean} config.bodyTogglable - Close menu when clicked on any part outside the `rootEl`
	 * @param {String} config.hashNavClass - Anchor's classname inside `targetEl`. Used mainly for fragement identifier. Say, when a link pointing to a fragement idenfitier is clicked, you want the menu automatically closed rather than staying open. 
	 */
	constructor(rootEl, config) {
    if (!rootEl) {
      return;
    } else if (!(rootEl instanceof HTMLElement)) {
      rootEl = document.querySelector(rootEl);
    }

    const toggleEl = rootEl.querySelector('[data-o-component="o-toggle"]');

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

    super(toggleEl, {target: targetEl});

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

	// `toggle()` inherited from `Toggle`.
  clickOnHash (e) {
    if (this.state && e.target.classList.contains(this.anchorClassName)) {
    // do not pass `e` to `toggle()`. You centainly do not want a link prevented.
      this.toggle();
    }
  }

	clickOnBody(e) {
		if (this.state && !this.rootEl.contains(e.target)) {
      this.toggle();
    }
	}

	handleEsc(e) {
    if (this.state && e.keyCode === 27) {
        this.toggle();
    }
  }
}

export default ToggleMenu;