import navData from './navData';

class Nav {
  constructor (navEl) {
    /**
     * @param navEl:TYPE String or 为空 or HTMLElement
     *  TYPE String:document.querySelector的那个选择器字符串,Eg:'[data-ftc-component]="ftc-component-channelnav"]'
     *  TYPE HTMLElement:属性data-ftc-component的值为ftc-channelnav的元素
    */

    // MARK: 处理constructor参数，得到this.header为本html中属性data-ftc-component为"ftc-header"的元素
		if (!navEl) {
			navEl = document.querySelector('[data-ftc-component]="ftc-channelnav"');
		} else if (!(navEl instanceof HTMLElement)) {
			navEl = document.querySelector(navEl);
    }
    this.navEl = navEl;

    this.data = navData;
    this.topListUl = navEl.querySelector('.ftc-header__nav-list.ftc-header__nav-toplist');
    this.subListUl = navEl.querySelector('.ftc-header__nav-list.ftc-header__nav-sublist');
    
    this.renderData = this.renderData.bind(this);
    this.handleClickTopItem = this.handleClickTopItem.bind(this);


    this.renderData();
    this.initSelected();

    this.topListUl.addEventListener('click',this.handleClickTopItem, false);
  }

  renderData() {
    if (this.topListUl && this.data.topChannels && this.data.topChannels.length > 0) {
      const topChannels = this.data.topChannels;
      var topListUlInnerHTML = '';
      var subListUlInnerHTML = '';
      var subChannels = [];
      for (const topChannel of topChannels) {
        console.log(topChannel.name);
        const oneLi = `<li class="ftc-header__nav-item ftc-header__nav-topitem"><a href=${topChannel.url}>${topChannel.name}</a></li>`;
        topListUlInnerHTML += oneLi;

        if (topChannel.selected) {
          subChannels = topChannel.subChannels;
        }
      }
      this.topListUl.innerHTML = topListUlInnerHTML;

      if (subChannels.length > 0) {
        for (const subChannel of subChannels) {
          const oneLi = `<li class="ftc-header__nav-item ftc-header__nav-subitem "><a href=${subChannel.url}>${subChannel.name}</a></li>`;
          subListUlInnerHTML += oneLi;
        }
        this.subListUl.innerHTML = subListUlInnerHTML;
        this.subListUl.style.display = 'block';
      }
    }
  }

  initSelected() {
    const topItemHomeEl = this.topListUl.querySelector('.ftc-header__nav-topitem:first-child');
    topItemHomeEl.classList.add('ftc-header__nav-topitem-selected');
  }

  handleClickTopItem(e) {
    console.log(e.target.tagName);
    const targetElem = e.target;
    if (targetElem.tagName === 'A') {
      console.log('here');
      const topElemSelected = this.topListUl.querySelector('.ftc-header__nav-topitem-selected');
      if (topElemSelected) {
        topElemSelected.classList.remove('ftc-header__nav-topitem-selected');
      }
      targetElem.parentNode.classList.add('ftc-header__nav-topitem-selected');
    }
  }

  static init(rootEl) {
    /**
		 * @param rootEl: TYPE HTMLElement or String or 为空
		 * 	TYPE HTMLElement,要初始化所有属性data-ftc-component为ftc-header-channelnav的元素的区域的顶级元素，Eg:header组件，即其上级的[data-ftc-component]="ftc-header"的元素
		 *  TYPE String: 以上HTMLElement使用document.querySelector传入的选择器字符串
		 */
		if (!rootEl) {
			rootEl = document.querySelector('[data-ftc-component="ftc-header"]');
		} else if (typeof rootEl === 'string') {
			rootEl = document.querySelector(rootEl);
    }
 
    if (rootEl.querySelector('[data-ftc-component="ftc-channelnav"]')) {
      const navEl = rootEl.querySelector('[data-ftc-component="ftc-channelnav"]');
      return new Nav(navEl);
    }
  }
}

export default Nav;