import navData from './navData';

class Nav {
  constructor (navEl, navData) {
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

    this.rootEl = document.querySelector('[data-ftc-component="ftc-header"]');
    
    this.topListUl = navEl.querySelector('.ftc-header__nav-list.ftc-header__nav-toplist');
    this.subListUl = navEl.querySelector('.ftc-header__nav-list.ftc-header__nav-sublist');
    
    this.initData = this.initData.bind(this);
    this.updateDataBaseSelectedTopChannel = this.updateDataBaseSelectedTopChannel.bind(this);
    this.updateDataBaseSelectedSubChannel = this.updateDataBaseSelectedSubChannel.bind(this);

    this.renderDataForTopList = this.renderDataForTopList.bind(this);
    this.renderDataForSubList = this.renderDataForSubList.bind(this);

    
    this.changeStyleForTopList = this.changeStyleForTopList.bind(this);
    this.changeStyleForSubList = this.changeStyleForSubList.bind(this);

    this.changeTop = this.changeTop.bind(this);

    this.handleClickTopItem = this.handleClickTopItem.bind(this);
    this.handleClickSubItem = this.handleClickSubItem.bind(this);

    this.initData();
    this.renderDataForTopList();
    this.renderDataForSubList();
    this.topListUl.addEventListener('click', this.handleClickTopItem, false);
    this.subListUl.addEventListener('click', this.handleClickSubItem, false);
  }

  initData() {
    /**
     * @dest 得到this.dataForTopChannels、this.dataForSubChannels、this.indexForSelectedTopChannel、this.nameForSelectedTopChannel
     */
    if (!navData.topChannels) {
      return;
    }
    this.dataForTopChannels = navData.topChannels;
    this.indexForSelectedTopChannel = navData.indexForSelectedTopChannel ? navData.indexForSelectedTopChannel : 0;
    this.indexForSelectedSubChannel = -1;
    this.updateDataBaseSelectedTopChannel();
  }

  updateDataBaseSelectedTopChannel() {
    /**
     * @dest 根据this.indexForSelectedTopChannel，更新this.dataForSubChannels、this.nameForSelectedTopChannel
     */
    const dataForTopChannels = this.dataForTopChannels;
    if (dataForTopChannels && dataForTopChannels.length > 0) {
      dataForTopChannels.forEach((value, arrIndex) => {
        if (value.index == this.indexForSelectedTopChannel) {
          this.dataForSubChannels = value.subChannels;
          this.nameForSelectedTopChannel = value.name;
        }
      })
    }
  }

  updateDataBaseSelectedSubChannel() {
    /**
     * @dest 根据this.indexForSelectedSubChannel，更新this.nameForSelectedSubChannel
     * @depend this.dataForSubchannels、this.indexForSelectedSubChannel
    */
    const dataForSubChannels = this.dataForSubChannels;
    if (dataForSubChannels && dataForSubChannels.length > 0) {
      this.dataForSubChannels.forEach((value, arrIndex) => {
        if (value.index == this.indexForSelectedSubChannel) {
          this.nameForSelectedSubChannel = value.name;
        }
      });
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
            const onePushdownli = `<li class="ftc-header__nav-pushdownitem" data-index=${subChannel.index}><a data-ftc--target-pushdown href=${subChannel.url}>${subChannel.name}</a></li>`;
            pushdownLiList += onePushdownli;
          }
        }
        
        const oneLi = `<li class="ftc-header__nav-item ftc-header__nav-topitem ${selectedCssClass}" data-index=${topChannel.index}><a data-ftc--target-top href=${topChannel.url} >${topChannel.name}</a><ul class="ftc-header__nav-pushdownlist">${pushdownLiList}</ul></li>`;//这里最后如果有空格，那么如果ul的font-size没有设为0,那么li之间会有空隙
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
      const dataForSubChannels = this.dataForSubChannels;
      let subListUlInnerHTML = '';

      for (const subChannel of dataForSubChannels) {
        const oneLi = `<li class="ftc-header__nav-item ftc-header__nav-subitem " data-index=${subChannel.index}><a href=${subChannel.url}>${subChannel.name}</a></li>`;
        subListUlInnerHTML += oneLi;
      }
      this.subListUl.innerHTML = subListUlInnerHTML;
      this.subListUl.style.display = 'block';
    }
  }

  
  changeStyleForTopList(toSelectElem) {
    /**
     * @dest 在click事件处理程序中调用，修改topList的样式，为将要选中的Li添加指定样式，为之前选中的Li移除样式
     * @param toSelectElem: TYPE HTMLElement, click事件将要选中的Li。
     */
    //移除已选择的elem的选中样式
    const selectedElem = this.topListUl.querySelector('.ftc-header__nav-topitem-selected');
    if (selectedElem) {
      selectedElem.classList.remove('ftc-header__nav-topitem-selected');
    }

    //为将选择的elem添加选中样式
    toSelectElem.classList.add('ftc-header__nav-topitem-selected');
  }

  changeStyleForSubList(toSelectElem) {
    /**
     * @dest 在click事件处理程序中调用，修改subList的样式，为将要选中的Li添加指定样式，为之前选中的Li移除样式
     * @param toSelectElem: TYPE HTMLElement, click事件将要选中的Li。
    */
    console.log('execute')
    //移除已选择的elem的选中样式
    const selectedElem = this.subListUl.querySelector('.ftc-header__nav-subitem-selected');
    if (selectedElem) {
      selectedElem.classList.remove('ftc-header__nav-subitem-selected');
    }
    

    //为将选择的elem添加选中样式
    toSelectElem.classList.add('ftc-header__nav-subitem-selected');
    console.log('toSelectElemAfter');
    console.log(toSelectElem);
  }

  changeTop() {
    /** 
     * @dest 根据this.indexForSelectedTopChannel以及this.indexForSelectedSubChannel来判断是首页还是频道页，然后修改顶部显示,包括中间的title及左边的brand
     * @depend this.indexForSelectedTopChannel、this.indexForSelectedSubChannel、this.nameForSelectedTopChannel、this.nameForSelectedSubChannel
     */
    if (!this.rootEl) {
      return;
    }
    
    const isHome = this.indexForSelectedTopChannel == 0 && this.indexForSelectedSubChannel == -1;
    console.log(`isHome:${isHome}`);
    const titleEl = this.rootEl.querySelector('[data-ftc-component="ftc-header-title"]');
    if (titleEl) {
      titleEl.classList.toggle('ftc-header-hometitle', isHome);
      titleEl.classList.toggle('ftc-header-tagtitle', !isHome);
      const titleText = this.indexForSelectedSubChannel >= 0 ? this.nameForSelectedSubChannel : this.nameForSelectedTopChannel;
      if (titleEl.classList.contains('ftc-header-tagtitle')) {
        titleEl.innerHTML = titleText;
      } else {
        titleEl.innerHTML = '';
      }
    }

    const langEl = this.rootEl.querySelector('[data-ftc-component="ftc-header-lang"]');
    if (langEl) {//只有是Home的时候才显示langEl
      langEl.classList.toggle('ftc-header--hide',!isHome);
    }

    const brandEl = this.rootEl.querySelector('.ftc-header__brand');
    if (brandEl) {
      brandEl.classList.toggle('ftc-header--hide', isHome);
    }

  }

  handleClickTopItem(e) {

    const targetElem = e.target;
    const toSelectElem = targetElem.parentNode;

    if (targetElem.tagName !== 'A') {
      return;
    }

    if (targetElem.hasAttribute('data-ftc--target-top')) { 
      /// 情况1：点击顶级菜单选项卡本身
      this.changeStyleForTopList(toSelectElem);

      //更新this.indexForSelectedTopChannel、this.dataForSubChannels、this.indexForSelectedTopChannel、this.nameForSelectedTopChannel
      this.indexForSelectedTopChannel = toSelectElem.getAttribute('data-index');
      this.indexForSelectedSubChannel = -1;
      this.updateDataBaseSelectedTopChannel();
      console.log(`nameForSelectedTopChannel:${this.nameForSelectedTopChannel}`);
      
      //重新渲染this.subListUl的数据
      this.renderDataForSubList();


      //根据this.indexForSelectedTopChannel来修改顶部显示
      this.changeTop();

    } else if (targetElem.hasAttribute('data-ftc--target-pushdown')) {
      /// 情况2：通过hover在某个顶级菜单选项卡上，浮现二级下来菜单，直接点击二级下拉菜单
      const topLiElem = toSelectElem.parentNode.parentNode;
      if (topLiElem && topLiElem.classList.contains('ftc-header__nav-topitem')) {

        this.indexForSelectedTopChannel = topLiElem.getAttribute('data-index');
        this.indexForSelectedSubChannel = toSelectElem.getAttribute('data-index');
        //console.log(`indexForSelectedTopChannel:${this.indexForSelectedTopChannel}`);
        //console.log(`indexForSelectedSubChannel:${this.indexForSelectedSubChannel}`);

        this.updateDataBaseSelectedTopChannel();
        this.updateDataBaseSelectedSubChannel();
        this.renderDataForSubList();

        const toSelectSubElem = this.subListUl.querySelector(`.ftc-header__nav-subitem[data-index="${this.indexForSelectedSubChannel}"]`);//获取新渲染的subList中的data-index符合this.indexForSelectedSubChannel的li

        this.changeStyleForTopList(topLiElem);
        this.changeStyleForSubList(toSelectSubElem);
        this.changeTop();
      }
    }
    
  }

  handleClickSubItem(e) {
    const targetElem = e.target;
    const toSelectElem = targetElem.parentNode;

    if (targetElem.tagName !== 'A') {
      return;
    }

    this.changeStyleForSubList(toSelectElem);

    //计算this.indexForSelectedTopChannel、this.nameForSelectedSubChannel
    this.indexForSelectedSubChannel = toSelectElem.getAttribute('data-index');
    this.updateDataBaseSelectedSubChannel();


    // 根据this.indexForSelectedSubChannel来修改顶部显示
    this.changeTop();
  
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
      const nav = new Nav(navEl, navData);
      console.log(`nameForSelectedTopChannel:${nav.nameForSelectedTopChannel}`);
      return nav;
    }
  }
}

export default Nav;