// import header需要的一系列子模块吧
import Nav from './nav';
import Lang from './lang';
import Hamburg from './hamburg';

class Header {
	constructor (headerEl) {
		/**
		 * @param headerEl: Type String or 为空 or  HTMLElement
		 * 	  TYPE String: document.querySelector的那个选择器字符串,Eg:'[data-ftc-component]="ftc-header"]'
		 *    TYPE Element: 直接就是目标header元素，其特征为具有属性data-ftc-component="ftc-header"
		 */

		// MARK: 处理constructor参数，得到this.header为本html中属性data-ftc-component为"ftc-header"的元素
		if (!headerEl) {
			headerEl = document.querySelector('[data-ftc-component]="ftc-header"');
		} else if (typeof headerEl === 'string') {
			headerEl = document.querySelector(headerEl);
		}

		//MARK：如果headerEl中已经含有属性'data-ftc-header--js，表明该headerEl已经是具有header相关的js了，故不用再做以下任何工作了。正常还不具备相关js的原始headerEl应该是含有属性'data-ftc-header--no-js'，而不含有'data-ftc-header--js'
		if (headerEl.hasAttribute('data-ftc-header--js')) {
			return;
		}
		this.headerEl = headerEl;

		// TODO:使用this.headerEl初始化其他几个子模块
		Nav.init(this.headerEl);
		Lang.init(this.headerEl);
		Hamburg.init(this.headerEl);
		
		// MARK:处理该headerEl的属性设置，因为已经添加了修改js功能模块，故移除属性'data-ftc-header--no-js'，添加属性'data-ftc-header--js'
		this.headerEl.removeAttribute('data-ftc-header--no-js');
		this.headerEl.setAttribute('data-ftc-header--js','')
	}

	static init (rootEl) {
		/**
		 * @param rootEl: TYPE HTMLElement or String
		 * 	TYPE HTMLElement,要初始化所有属性data-ftc-component为ftc-header的元素的区域的顶级元素，Eg:document.body
		 *  TYPE String: 以上HTMLElement使用document.querySelector传入的选择器字符串
		 */
		if (!rootEl) {
			rootEl = document.body;
		} else if (typeof rootEl === 'string') {
			rootEl = document.querySelector(rootEl);
		}

		// MARK:如果rootEl本身含有属性data-ftc-component=ftc-header,则返回一个new Header(rootEl)
		if (/\bftc-header\b/.test(rootEl.getAttribute('data-ftc-component'))) { //NOTE:用带有零宽单词边界\b的正则匹配，可以包容该属性的写法为data-ftc-component=" ftc-header"/"ftc-header "这种前后有空格的情况。
			return new Header(rootEl);
		}

		// MARK: 如果rootEl本身不含属性data-ftc-component=ftc-header,但其下的子元素中含有属性'data-ftc-component = "ftc-header"'，如果这些子元素不具有属性'data-ftc-header--js'那么就返回一个new Header(el),这样就得到了一系列的new Header(el),然后过滤掉其中为undefined的new Header(el), 以返回其中不为undefined的new Header(el) —— 这是因为new Header(el)处理已经具有属性'data-ftc-header--js'的元素时，会直接return,那么这个new Header(el)的结果就是undefined
		return [].map.call(rootEl.querySelectorAll('[data-ftc-component="ftc-header"'), el => {
			if (!el.hasAttribute('data-ftc-header--js')) {
				return new Header(el);
			}
		}).filter( el => {
			return el !== undefined;//MARK:
		})
	}
}

export default Header;