class Login {
  constructor(loginEl) {
    /**
     * @param TYPE String or 为空 or HTMLElement
     *  TYPE String:rootEl.querySelector的那个选择器字符串,Eg:'[data-ftc-component="ftc-header-search"]'
     *  TYPE HTMLElement:属性data-ftc-component的值为ftc-header-login的元素
     */
    if (!loginEl) {
      loginEl = document.querySelector('[data-ftc-component="ftc-header-login"]');
    } else if (!(loginEl instanceof HTMLElement)) {
      loginEl = document.querySelector(loginEl);
    }
    this.loginEl = loginEl;

    this.getCookie = this.getCookie.bind(this)
  }

  isMember() {
    this.userName
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

  static init () {

  }
}