class Sign {
  constructor(signEl) {
    /**
     * @param signEl TYPE String or 为空 or HTMLElement
     *  TYPE String:rootEl.querySelector的那个选择器字符串,Eg:'[data-ftc-component="ftc-header-search"]'
     *  TYPE HTMLElement:属性data-ftc-component的值为ftc-header-login的元素
     */
    console.log('construct sign');
    if (!signEl) {
      signEl = document.querySelector('[data-ftc-component="ftc-header-sign"]');
    } else if (!(signEl instanceof HTMLElement)) {
      signEl = document.querySelector(signEl);
    }
    this.signEl = signEl;
    console.log(signEl);
    this.signinEl = signEl.querySelector('.ftc-header__sign-signin');
    this.visitorMenu = this.signEl.querySelector('.ftc-header__sign-visitormenu');
    this.memberMenu = this.signEl.querySelector('.ftc-header__sign-memebermenu');
    this.getCookie = this.getCookie.bind(this);
    this.setHasSignin = this.setHasSignin.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.handleSigninOverlay = this.handleSigninOverlay.bind(this);

    this.setHasSignin();
    this.showMenu(this.hasSignin);
    this.handleSigninOverlay();
    
    
  }

  setHasSignin() {
    /**
     * @dest 根据cookie username是否有值来判断是否已经登录了
     * 生成this.hasSignIn
     */
    const userName = this.getCookie('username');//待学习：该cookie的生成应该是登录的时候服务器返回的值吧？看起来不像是用户本身的用户名，而像是在服务器端加密过的。
    if (userName) {
      this.hasSignin = true;
    } else {
      this.hasSignin = false;
    }
  }

  showMenu(hasSignin) {
    /**
     * @dest 根据this.hasSignin决定显示哪种菜单：
     * @param hasSignin TYPE String: 就是this.hasSignin
     */
    this.visitorMenu.classList.toggle('ftc-header__sign--hide', hasSignin);
    this.memberMenu.classList.toggle('ftc-header__sign--hide',!hasSignin);
  }
  handleSigninOverlay() {
    if (!this.signinEl) {
      return;
    }
    const loginOverlay = document.querySelector('[data-ftc-component="ftc-header-loginoverlay"]');
    if (!loginOverlay) {
      return;
    }

    this.signinEl.addEventListener('click', function(e) {
      e.preventDefault();
      loginOverlay.classList.add('ftc-header__loginoverlay--show');

      const loginOverlayCloseEl = loginOverlay.querySelector('.ftc-header__loginoverlay-close');
      console.log(loginOverlayCloseEl);
      if (!loginOverlayCloseEl) {
        return;
      }
      loginOverlayCloseEl.addEventListener('click', function() {
        loginOverlay.classList.remove('ftc-header__loginoverlay--show');
      });
    });

    
  }
  showSigninOverlay(e) {
    /**
     * @param e TYPE event对象
     */    
    e.preventDefault();
    this.loginOverlay.classList.add('ftc-header__loginoverlay--show');
  }
  closeSigninOverlay(e) {
    this.loginOverlay.classList.remove('ftc-header__loginoverlay--show');
  }
  getCookie(name) {//待写入ftc-utils
    var start = document.cookie.indexOf(name+'='),
        len = start+name.length+1,
        end = document.cookie.indexOf(';',len);
    if ((!start) && (name !== document.cookie.substring(0,name.length))) {return null;}
    if (start === -1) {return null;}
    if (end === -1) {end = document.cookie.length; }
    return decodeURIComponent(document.cookie.substring(len,end));
 }


  static init (rootEl) {
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

    if (rootEl.querySelector('[data-ftc-component="ftc-header-sign"]')) {
        const signEl = rootEl.querySelector('[data-ftc-component="ftc-header-sign"]');
        return new Sign(signEl);
    }
  }
}

export default Sign;