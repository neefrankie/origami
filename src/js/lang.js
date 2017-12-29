class Lang {
    constructor(langEl) {
        /**
         * @param langEl:TYPE String or 为空 or HTMLElement
         *  TYPE String:document.querySelector的那个选择器字符串,Eg:'[data-ftc-component="ftc-header-lang"]'
         *  TYPE HTMLElement:属性data-ftc-component的值为ftc-header-lang的元素
        */
        if (!langEl) {
            langEl = document.querySelector('[data-ftc-component="ftc-header-lang"]');
        } else if (!(langEl instanceof HTMLElement)) {
            langEl = document.querySelector(langEl);
        }
        this.langEl = langEl;

        const langList = langEl.querySelector('.ftc-header__lang-list');
        if(!langList) {
            return;
        }
        this.langList = langList;

        const langFistItem = langList.querySelector('.ftc-header__lang-item');
        if(!langFistItem) {
            return;
        }
        this.langFistItem = langFistItem;

        this.toggle = this.toggle.bind(this);
        this.langFistItem.addEventListener('click',this.toggle,false)
    }

    toggle(e) {
       if(this.langList.className.indexOf('ftc-header__lang-listdefault') < 0) { // To fold
            this.langList.classList.add('ftc-header__lang-listdefault');
        }
        else { // To Unfold
            this.langList.classList.remove('ftc-header__lang-listdefault');
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

        if (rootEl.querySelector('[data-ftc-component="ftc-header-lang"]')) {
            const langEl = rootEl.querySelector('[data-ftc-component="ftc-header-lang"]');
            return new Lang(langEl);
        }
    }
}

export default Lang;