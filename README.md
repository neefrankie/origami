# ftc-header

The responsive header component for FTChinese. There are three kinds of headers to choose. 

This package provides both js and sass APIs for building these headers.

## Install
```
npm install "@ftchinese/ftc-header" --save
```

## Prepare the html 
Before using our APIs, you may first prepare the html code.

The root element of ftc-header is a **header**, which should have the attribute **data-ftc-component="ftc-header"** and the class **class="ftc-header"**:

```
<header class="ftc-header" data-ftc-component="ftc-header" data-ftc-header--no-js>
</header>
``` 

For the content of the root element, there are 3 default structure you can choose:

### Standard head:
```
<header class="ftc-header" data-ftc-component="ftc-header" data-ftc-header--no-js>

	<div class="ftc-header__top ">
		<div class="ftc-header__container">
			<div class="ftc-header__top-column ftc-header__top-center  ftc-header-hometitle" data-ftc-component="ftc-header-title">
			</div>

			<div class="ftc-header__top-column ftc-header__top-left">
				<div class="ftc-header__lang" data-ftc-component="ftc-header-lang">
					<ul class="ftc-header__lang-list ftc-header__lang-listdefault">
						<li class="ftc-header__lang-item">
							<a href=#>
								简体中文
							</a>
						</li>	
						<li class="ftc-header__lang-item">
							<a href=http://big5.ftchinese.com/>
								繁体中文
							</a>
						</li>		
						<li class="ftc-header__lang-item">
							<a href=https://www.ft.com/>
								英文
							</a>
						</li>		
					</ul>
				</div>
				<div class="ftc-header__brand ftc-header--hide">

				</div>
				<div class="ftc-header__hamburg" data-ftc-component="ftc-header-hamburg">
				</div>
			</div>

			<div class="ftc-header__top-column ftc-header__top-right">
					<div class="ftc-header-readermenu ftc-header-readermenu-visitor">
						<a href=http://user.ftchinese.com/login>
							登录
						</a>
						<a href=http://user.ftchinese.com/register>
							免费注册
						</a>
					</div>
					<div class="ftc-header-readermenu ftc-header-readermenu-member">
						<a href=/users/mystories>
							我的FT
						</a>
						<a href=/users/cp>
							设置
						</a>
						<a href=http://user.ftchinese.com/logout>
							登出
						</a>
					</div>
			</div>
		</div>
	</div>
	
	<nav class="ftc-header__nav" data-ftc-component="ftc-channelnav" role="navigation" aria-label="Main navigation">
		<ul class="ftc-header__nav-list ftc-header__nav-toplist" data-ftc--sticky>	
		</ul>
		<ul class="ftc-header__nav-list ftc-header__nav-sublist">	
		</ul>
	</nav>

	<div class="ftc-header__search ftc-header__search-default  ftc-header__row" data-ftc-component="ftc-header-search" data-ftc--sticky >
		<div class="ftc-header__container">
		
			<form class="ftc-header__search-formregion" action=/search/ role="search">
				<button class="ftc-header__search-searchbtn"></button>
				<div class="ftc-header__search-inputarea">
					<input class="ftc-header__search-input" type="search" placeholder=输入年月日‘xxxx-xx-xx’可搜索该日存档 >
				</div>
				</form>
			</form>
			<div class="ftc-header__search-switch">
			</div>
		</div>
	</div>
	
</header>
```

The standard header contains the all little parts of header of our FTChinese website. And the nav of standard header is realized dynamically with js, the data of which is from a javascript object that will be dynamically written when the header is constructed.

### Simple head
```
<header class="ftc-header" data-ftc-component="ftc-header" data-ftc-header--no-js>

	
	<div class="ftc-header__top ">
		<div class="ftc-header__container">

			<div class="ftc-header__top-column ftc-header__top-center ftc-header-hometitle">
			</div>


			<div class="ftc-header__top-column ftc-header__top-right">
					<div class="ftc-header-readermenu ftc-header-readermenu-visitor">

						<a href=http://user.ftchinese.com/login>
							登录
						</a>

						<a href=http://user.ftchinese.com/register>
							免费注册
						</a>

					</div>
					<div class="ftc-header-readermenu ftc-header-readermenu-member">
						<a href=/users/mystories>
							我的FT
						</a>
						<a href=/users/cp>
							设置
						</a>
						<a href=http://user.ftchinese.com/logout>
							登出
						</a>
					</div>
			</div>
			
		</div>
	</div>
</header>
```

The simple header has no nav, lang or search components, which is in a very very simple and easy style.  If you build a single page which is not close to our hosting site, you may choose this simple header.

### Static Nav Header
If you want the header of your page looks like the hosting site's header, but you do not want to bother with the details of the interaction with the backend, you'd better choose this kind of header.

Here provide the html and data in Nunjucks way.
```
<header class="ftc-header" data-ftc-component="ftc-header" data-ftc-header--no-js>

	<div class="ftc-header__top ">
		<div class="ftc-header__container">

			<div class={{'"ftc-header__top-column ftc-header__top-center ftc-header-hometitle"' if isHome == 1 else '"ftc-header__top-column ftc-header__top-center ftc-header-tagtitle"'}} data-ftc-component="ftc-header-title">
          {{header.myTitle}}
			</div>

    
			<div class="ftc-header__top-column ftc-header__top-left">

				<div class="ftc-header__brand">
        </div>
				<div class="ftc-header__hamburg" data-ftc-component="ftc-header-hamburg">
				</div>
			</div>
      
			<div class="ftc-header__top-column ftc-header__top-right">
					<div class="ftc-header-readermenu ftc-header-readermenu-visitor">

						<a href={{header.signUp.url}}>
							{{header.signUp.word}}
						</a>

						<a href={{header.signIn.url}}>
							{{header.signIn.word}}
						</a>

					</div>
					<div class="ftc-header-readermenu ftc-header-readermenu-member">
						<a href={{header.myFT.url}}>
							{{header.myFT.word}}
						</a>
						<a href={{header.mySet.url}}>
							{{header.mySet.word}}
						</a>
						<a href={{header.signOut.url}}>
							{{header.signOut.word}}
						</a>
					</div>
			</div>
			
		</div>
	</div>

	{% if header.nav %}
	<nav class="ftc-header__nav" data-ftc-component="ftc-channelnav" role="navigation" aria-label="Main navigation">
		<ul class="ftc-header__nav-list ftc-header__nav-toplist" data-ftc--sticky>
      {% set subChannels = {} %}
    	{% for topChannel in header.nav.topChannels %}
 			<li class={{'"ftc-header__nav-item ftc-header__nav-topitem ftc-header__nav-topitem-selected"' if header.nav.indexForSelectedTopChannel==topChannel.index else '"ftc-header__nav-item ftc-header__nav-topitem"'}} data-index={{topChannel.index}}>
          <a data-ftc--target-top href={{topChannel.url}} >{{topChannel.name}}</a>
          <ul class="ftc-header__nav-pushdownlist">
						{% for pushdownChannel in topChannel.subChannels %}
							<li class="ftc-header__nav-pushdownitem" data-index={{pushdownChannel.index}}><a data-ftc--target-pushdown href={{pushdownChannel.url}}>{{pushdownChannel.name}}</a></li>
						{% endfor %}
          </ul>
      </li>
        {% if header.nav.indexForSelectedTopChannel==topChannel.index %}
          {% set subChannels = topChannel.subChannels %}
        {% endif %}
	    {% endfor %}
		</ul>
		<ul class="ftc-header__nav-list ftc-header__nav-sublist">
      {% for subChannel in subChannels %}
        <li class={{ '"ftc-header__nav-item ftc-header__nav-subitem ftc-header__nav-subitem-selected"' if header.nav.indexForSelectedSubChannel==subChannel.index else '"ftc-header__nav-item ftc-header__nav-subitem"' }} data-index={{subChannel.index}}>
            <a href={{subChannel.url}}>{{subChannel.name}}</a>
        </li>
      {% endfor %}
		</ul>
	</nav>

	{% endif %}
</header>
```

And your data is in a json file:
```
{
  "myTitle":"我的页面",
	"signUp":{
		"url":"http://user.ftchinese.com/login",
		"word":"登录"
	},
	"signIn":{
		"url":"http://user.ftchinese.com/register",
		"word":"免费注册"
	},
	"myFT":{
		"url":"/users/mystories",
		"word":"我的FT"
	},
	"mySet":{
		"url":"/users/cp",
		"word":"设置"
	},
	"signOut":{
		"url":"http://user.ftchinese.com/logout",
		"word":"登出"
	},
  
	"nav": {
    "indexForSelectedTopChannel": 0,
    "indexForSelectedSubChannel": 8,
    "topChannels": [
      {
        "name": "首页",
        "url": "#",
        "index":0,
        "subChannels":[
          {
            "name":"特别报道",
            "url":"http://www.ftchinese.com/channel/special.html",
            "index":0
          },
          {
            "name":"热门文章",
            "url":"http://www.ftchinese.com/channel/special.html",
            "index":1
          },
          {
            "name":"会议活动",
            "url":"http://www.ftchinese.com/m/events/event.html",
            "index":2
          },
          {
            "name":"会员信息中心",
            "url":"http://www.ftchinese.com/m/marketing/home.html",
            "index":3
          },
          {
            "name":"FT商学院",
            "url":"http://www.ftchinese.com/channel/mba.html",
            "index":4
          },
          {
            "name":"FT电子书",
            "url":"http://www.ftchinese.com/m/marketing/ebook.html",
            "index":5
          },
          {
            "name":"图辑",
            "url":"http://www.ftchinese.com/channel/slides.html",
            "index":6
          },
          {
            "name":"职业机会",
            "url":"https://ft.wd3.myworkdayjobs.com/FT_Chinese_External_Careers",
            "index":7
          },
          {
            "name":"数据新闻",
            "url":"http://www.ftchinese.com/channel/datanews.html",
            "index":8
          },
          {
            "name":"FT研究院",
            "url":"http://www.ftchinese.com/m/marketing/intelligence.html",
            "index":9
          },
          {
            "name":"FT商城",
            "url":"https://shop193762308.taobao.com/",
            "index":10
          }
        ]  
      },
      {
        "name": "中国",
        "url": "http://www.ftchinese.com/channel/china.html",
        "index":1,
        "subChannels":[
          {
            "name":"政经",
            "url":"http://www.ftchinese.com/channel/chinareport.html",
            "index":0
          },
          ...
        ]
      },
      {
        "name": "全球",
        "url": "http://www.ftchinese.com/channel/world.html",
        "index":2
      },
	  ...
    ]
  }
}
```

## API for JS
### For Standard Header
```
import oGrid from '../../bower_components/o-grid/main.js';
import {Header} from '../../main.js';

Header.init();
```

### For Simple Header
```
import oGrid from '../../bower_components/o-grid/main.js';
import {SimpleHeader} from '../../main.js';

SimpleHeader.init();
```

### For Static Nav Header
```
import oGrid from 'bower_components/o-grid/main.js';
import {StaticNavHeader} from 'ftc-header/main.js';

StaticNavHeader.init();
```

## API for SCSS
The simplest way is to set the **$ftc-header-is-silent** to be false, and what you need to do is just import the main.scss
```
$ftc-header-is-silent: false;

@import 'ftc-header/main';
```
These is propably suitbale for the Standard Header.

As for Simple Header, you may choose to include the mixin as you need:

```
$ftc-header-is-silent: true;

@import 'ftc-header/main';

@include ftcHeaderBase;
@include ftcHeaderTop;
```

And for Static Nav Header:
```
$ftc-header-is-silent: true;

@import 'ftc-header/main';

@include ftcHeaderBase;
@include ftcHeaderTop;
@include ftcHeaderNav;
```
