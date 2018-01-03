class Hamburg {
    constructor(hamburgEl, rootEl) {
        /**
         * @param hamburgEl:TYPE String or 为空 or HTMLElement
         *  TYPE String:document.querySelector的那个选择器字符串,Eg:'[data-ftc-component="ftc-header-hamburg"]'
         *  TYPE HTMLElement:属性data-ftc-component的值为ftc-header-hamburg的元素
         * @param rootEl: TYPE HTMLElement or String or 为空
		 * 	TYPE HTMLElement,要初始化属性data-ftc-component为ftc-header-hamburg的元素的顶级元素，Eg:header组件，即其上级的[data-ftc-component]="ftc-header"的元素
		 *  TYPE String: 以上HTMLElement使用document.querySelector传入的选择器字符串
        */
        if (!hamburgEl) {
            hamburgEl = document.querySelector('[data-ftc-component="ftc-header-hamburg"]');
        } else if (!(hamburgEl instanceof HTMLElement)) {
            hamburgEl = document.querySelector(hamburgEl);
        }
        this.hamburgEl = hamburgEl;

        if (!rootEl) {
			rootEl = document.querySelector('[data-ftc-component="ftc-header"]');
		} else if (typeof rootEl === 'string') {
			rootEl = document.querySelector(rootEl);
        }
        this.rootEl = rootEl;

        const navEl = rootEl.querySelector('[data-ftc-component="ftc-channelnav"]');
        if (!navEl) {
            return;
        }
        this.navEl = navEl;

        this.toggle = this.toggle.bind(this);
        this.hamburgEl.addEventListener('click',this.toggle,false)
    }

    toggle(e) {
       this.hamburgEl.classList.toggle('ftc-header__close');
       if (this.hamburgEl.classList.contains('ftc-header__close')) {
           this.navEl.style.display = 'block';
       } else {
           this.navEl.style.display = 'none';
       }
    }
    


    static init(rootEl) {
        /**
		 * @param rootEl: TYPE HTMLElement or String or 为空
		 * 	TYPE HTMLElement,要初始化所有属性data-ftc-component为ftc-header-lang的元素的区域的顶级元素，Eg:header组件，即其上级的[data-ftc-component]="ftc-header"的元素
		 *  TYPE String: 以上HTMLElement使用document.querySelector传入的选择器字符串
		 */
		if (!rootEl) {
			rootEl = document.querySelector('[data-ftc-component="ftc-header"]');
		} else if (typeof rootEl === 'string') {
			rootEl = document.querySelector(rootEl);
        }

        if (rootEl.querySelector('[data-ftc-component="ftc-header-hamburg"]')) {
            const hamburgEl = rootEl.querySelector('[data-ftc-component="ftc-header-hamburg"]');
            return new Hamburg(hamburgEl, rootEl);
        }
    }
}

export default Hamburg;