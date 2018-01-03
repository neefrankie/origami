class Sticky {
  constructor(stickyEl) {
     /**
         * @param stickyEl:TYPE String or 为空 or HTMLElement,即将sticky的那个元素
         *  TYPE String:document.querySelector的那个选择器字符串,Eg:'[data-ftc--sticky]'
         *  TYPE HTMLElement:含有属性data-ftc--sticky的值为ftc-header-lang的元素
         * @param stickyClass: Type Sting, the class name of sticky style
        */
      if (!stickyEl) {
        stickyEl = document.querySelector('[data-ftc--sticky]');
      } else if (!(stickyEl instanceof HTMLElement)) {
        stickyEl = document.querySelector(stickyEl);
      }
      this.stickyEl = stickyEl;

      this.getOffsetTop = this.getOffsetTop.bind(this);
      this.getOffsetTop();
      console.log(this.offsetTop);
      this.getScrollTop = this.getScrollTop.bind(this);
      this.stickyWhenScroll = this.stickyWhenScroll.bind(this);
      window.addEventListener('scroll', this.stickyWhenScroll);
  }

  getOffsetTop() { /**待写入 ftc-utils */
    /**
     * @dest 获得el元素在距页面顶部的距离。即得到this.offsetTop。对应NEXT中main.js的findTop函数.
     * @param el:想要在滚动时粘住的元素
     */
    let curTop = 0;
    let el = this.stickyEl;
    while (el && el.offsetParent) { 
      //NOTE:HTMLElement.offsetParent 是一个只读属性，返回一个指向最近的（closest，指包含层级上的最近）包含该元素的定位元素。
      curTop += el.offsetTop;//NOTE:HTMLElement.offsetTop 为只读属性，它返回当前元素相对于其 offsetParent 元素的顶部的距离。
      el = el.offsetParent;

    }
    this.offsetTop = curTop;
  }

  getScrollTop() { /**待写入ftc-utils */
    /**
     * @dest 获得光标现在滚动到的位置距页面顶部的距离。
     */
    const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    /*NOTE:document.compatMode：表明文档的渲染模式是混杂模式or标准模式
    * 混杂模式值为 "BackCompat"
    * 标准模式值为 "CSS1Compat"
    */
    return window.pageYOffset || isCSS1Compat ? document.documentElement.scrollTop : document.body.srcollTop;
    /* NOTE:
     * window.scrollY:返回文档在垂直方向已滚动的像素值
     * window.pageYOffset:scrollY的别名。为了跨浏览器兼容，请使用 window.pageYOffset 代替 window.scrollY。但IE9以下两种属性都不支持，需要使用scrollTop
     * Element.scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数。
    */
  }

  stickyWhenScroll() {
    const scrollTop = this.getScrollTop();
    const isSticky = scrollTop > this.offsetTop ? true : false;
    console.log(isSticky);
    this.stickyEl.classList.toggle('ftc-header--sticky',isSticky);
  }

  static init(rootEl) {
     /**
     * @param rootEl: TYPE HTMLElement or String or 为空
     * 	TYPE HTMLElement,要初始化所有具有属性data-ftc--sticky的元素的区域的顶级元素，Eg:header组件，即其上级的[data-ftc-component]="ftc-header"的元素
     *  TYPE String: 以上HTMLElement使用document.querySelector传入的选择器字符串
    */
    if (!rootEl) {
      rootEl = document.querySelector('[data-ftc-component="ftc-header"]');
    } else if (typeof rootEl === 'string') {
      rootEl = document.querySelector(rootEl);
    }
    //const stickyEl = rootEl.querySelector('[data-ftc--sticky');
    
    const stickyElems = rootEl.querySelectorAll('[data-ftc--sticky]');
    
    const stickyResultElems = [].map.call(stickyElems, el => {
      return new Sticky(el);
    });
    return stickyElems;
  // return new Sticky(stickyEl);
  }
}

export default Sticky;