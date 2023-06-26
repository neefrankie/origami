class Search {
  constructor(searchEl) {
    /**
     * @param searchEl:TYPE String or 为空 or HTMLElement
     *  TYPE String:rootEl.querySelector的那个选择器字符串,Eg:'[data-ftc-component="ftc-header-search"]'
     *  TYPE HTMLElement:属性data-ftc-component的值为ftc-header-search的元素
    */
      
 
      if (!searchEl) {
        searchEl = document.querySelector('[data-ftc-component="ftc-header-search"]');
      } else if (!(searchEl instanceof HTMLElement)) {
        searchEl = document.querySelector(searchEl);
      }
      this.searchEl = searchEl;

      const switchEl = searchEl.querySelector('.ftc-header__search-switch');
      if (!switchEl) {
        return;
      } 
      this.switchEl = switchEl;

      this.toggle = this.toggle.bind(this);
      this.switchEl.addEventListener('click',this.toggle,false);
  }

  toggle(e) {
    this.searchEl.classList.toggle('ftc-header__search-default');
  }

  static init(rootEl) {
    /**
     * @param rootEl: TYPE HTMLElement or String or 为空
     * 	TYPE HTMLElement,要初始化所有属性data-ftc-component为ftc-header-search的元素的区域的顶级元素，Eg:header组件，即其上级的[data-ftc-component]="ftc-header"的元素
     *  TYPE String: 以上HTMLElement使用document.querySelector传入的选择器字符串
    */
    if (!rootEl) {
      rootEl = document.querySelector('[data-ftc-component="ftc-header"]');
    } else if (typeof rootEl === 'string') {
      rootEl = document.querySelector(rootEl);
    }

    if (rootEl.querySelector('[data-ftc-component="ftc-header-search"]')) {
        const searchEl = rootEl.querySelector('[data-ftc-component="ftc-header-search"]');
        return new Search(searchEl);
    }
  }
}

export default Search;