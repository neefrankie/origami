import navData from './navData';

class Nav {
  constructor (navEl) {
    /**
     * @param navEl:TYPE String or 为空 or HTMLElement
     *  TYPE String:document.querySelector的那个选择器字符串,Eg:'[data-ftc-component="ftc-component-channelnav"]'
     *  TYPE HTMLElement:属性data-ftc-component的值为ftc-channelnav的元素
    */

    // MARK: 处理constructor参数，得到this.header为本html中属性data-ftc-component为"ftc-header"的元素
		if (!navEl) {
			navEl = document.querySelector('[data-ftc-component]="ftc-channelnav"');
		} else if (!(navEl instanceof HTMLElement)) {
			navEl = document.querySelector(navEl);
    }
    this.navEl = navEl;

   
    this.topListUl = navEl.querySelector('.ftc-header__nav-list.ftc-header__nav-toplist');
    this.subListUl = navEl.querySelector('.ftc-header__nav-list.ftc-header__nav-sublist');
    
    this.initData = this.initData.bind(this);
    this.renderDataForTopList = this.renderDataForTopList.bind(this);
    this.renderDataForSubList = this.renderDataForSubList.bind(this);
    this.handleClickTopItem = this.handleClickTopItem.bind(this);

    this.initData();
    this.renderDataForTopList();
    this.renderDataForSubList();
    this.topListUl.addEventListener('click',this.handleClickTopItem, false);
  }

  initData() {
    /**
     * @dest 得到this.dataForTopChannels、this.dataForSubChannels、this.indexForSelectedTopChannel
     */
    if (!navData.topChannels) {
      return;
    }
    this.dataForTopChannels = navData.topChannels;
    this.indexForSelectedTopChannel = navData.indexForSelectedTopChannel ? navData.indexForSelectedTopChannel : 0;

    const dataForTopChannels = this.dataForTopChannels;
    if (dataForTopChannels && dataForTopChannels.length > 0) {
      dataForTopChannels.forEach((value, arrIndex) => {
        if (value.index == this.indexForSelectedTopChannel) {
          this.dataForSubChannels = value.subChannels;
        }
      })
    }
  }


  renderDataForTopList() {
    /**
     * @dest 渲染this.topListUl
     * @depend this.dataForTopChannels、this.indexForSelectedTopChannel
     * @explain:该方法只用首次调用一次，因为TopList的数据是固定的。并在这唯一一次调用中给默认数据中符合index为indexForSelectedTopChannel的li添加选中样式。
     */

    //渲染this.topListUl
    if (this.topListUl && this.dataForTopChannels && this.dataForTopChannels.length > 0) {
      const dataForTopChannels = this.dataForTopChannels;
      let topListUlInnerHTML = '';

      for (const topChannel of dataForTopChannels) {
        const selectedCssClass = topChannel.index == this.indexForSelectedTopChannel ? 'ftc-header__nav-topitem-selected' : ''; 
        
        //下拉二级菜单
        let pushdownLiList = '';
        const dataForTempSubChannels = topChannel.subChannels;
        if (dataForTempSubChannels && dataForTempSubChannels.length>0) {
          for (const subChannel of topChannel.subChannels) {
            const onePushdownli = `<li class="ftc-header__nav-pushdownitem"><a href=${subChannel.url}>${subChannel.name}</a></li>`;
            pushdownLiList += onePushdownli;
          }
        }
        

        const oneLi = `<li class="ftc-header__nav-item ftc-header__nav-topitem ${selectedCssClass}" data-index=${topChannel.index}><a href=${topChannel.url} >${topChannel.name}</a><ul class="ftc-header__nav-pushdownlist">${pushdownLiList}</ul></li>`;
        topListUlInnerHTML += oneLi;
      }
      this.topListUl.innerHTML = topListUlInnerHTML;
    }
  }

  renderDataForSubList() {
    /**
     * @dest 渲染this.subListUl
     * @depend this.dataForSubChannels
     * @explain:该方法除了首次调用以外，还需要在handleClickTopItem中调用。因为subList的数据是变化，除了首次渲染时根据默认数据中indexForSelectedTopChannel来确定数据，在点击其他topItem后,this.indexForSelectedTopChannel值改变，this.dataForSubChannel也会改变，故会再次调用。
     */
    //渲染this.subListUl
    if (this.subListUl && this.dataForSubChannels && this.dataForSubChannels.length > 0) {
      console.log('first render subChannel');
      const dataForSubChannels = this.dataForSubChannels;
      let subListUlInnerHTML = '';

      for (const subChannel of dataForSubChannels) {
        const oneLi = `<li class="ftc-header__nav-item ftc-header__nav-subitem "><a href=${subChannel.url}>${subChannel.name}</a></li>`;
        subListUlInnerHTML += oneLi;
      }
      this.subListUl.innerHTML = subListUlInnerHTML;
      this.subListUl.style.display = 'block';
    }
  }

  handleClickTopItem(e) {
    console.log(e.target.tagName);
    const targetElem = e.target;
    const toSelectElem = targetElem.parentNode;

    if (targetElem.tagName !== 'A') {
      return;
    }
    console.log('here');

    //移除已选择的elem的选中样式
    const selectedElem = this.topListUl.querySelector('.ftc-header__nav-topitem-selected');
    if (selectedElem) {
      selectedElem.classList.remove('ftc-header__nav-topitem-selected');
    }

    //为将选择的elem添加选中样式
    toSelectElem.classList.add('ftc-header__nav-topitem-selected');
    console.log(toSelectElem);
    //更新this.indexForSelectedTopChannel、this.dataForSubChannels
    this.indexForSelectedTopChannel = toSelectElem.getAttribute('data-index');
    this.dataForTopChannels.forEach((value, arrIndex) => {
      if (value.index == this.indexForSelectedTopChannel) {
        this.dataForSubChannels = value.subChannels;
      }
    });
    
    //再次渲染this.subListUl
    this.renderDataForSubList();
    
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