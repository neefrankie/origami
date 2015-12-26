## Install
```
bower install ftc-share --save
```
## Getting started

The simplest markup you might need looks like this:

```html
<div data-component="ftc-share"
    class="ftc-share"
    data-share-links="{{links}}">
</div>
```

The different options are:

* `links`: List of lower case social networks to be added separated by a space.

The different social networks are:

* Wechat
* Weibo
* Linkedin
* Facebook
* Twitter

### Instantiation

#### Javascript
To instantiate the JavaScript:

```javascript
var ftcShare = require('ftc-share');
var ftcShare.create(document.querySelector('[data-component=ftc-share]'));
```

The markup will be generated for that instance of `ftc-share`.

You can also instantiate all instances in your page by running `ftcShare.createAll()` which returns an array with all of them.

#### Sass

```scss
@import 'o-share/main';
```

## API
```javascript
	ftcShare.create([rootEl, socialList, configopt]);
```
`rootEl` is the share button's container. It could be either an id, class or HTMLElement. If you ommit this param, it will default to `document.body`.

`socialList` is an optional array listing the social share platforms. Currently Available: 'wechat', 'weibo', 'linkedin', 'facebook', 'twitter'. Deafult to select all.

If you do not pass the `socialList` param, the script will first try to find wether the container element has a `data-share-links` atrribute. If `data-share-links` exists, it will get the value of this attribute and split the value into an array. If it failed to find this attribute, the default list will be used.

`config` is an object containing the information used as the share button's `href` value:

```javascript	
	var config = {
		url: //string. The url to share. Usually default to window.location.href.
		title: // string. The title to show when shared.
		summary: // string. A short messge to be shared
	}
```

If you do not pass the `config`, the script will search `<meta>` and `<title>` tag for related infomation. You should at leat provide a `meta` tag with the following attributes and values in your HTML file:

```html
<meta name="description" content="This will be used as the config.summary value" />
```

### Example:

```javascript
var socialList = ['wechat', 'weibo', 'linkedin'];
var config = {
    url: window.location.href,
    title: 'Syria oil map',
    summary: 'How the Isis oil economy works, explained through the journey of a barrel of oil in Syria',
};
ftcShare.create('.share-links', socialList, config);
```

### Generated Markup
```html
<ul>
    <li>
        <a class="share-link share-wechat" href="" target="_blank">
            <i class="icon-social-wechat"></i>
            <span>微信</span>
        </a>
    </li>
</ul>
```

### Background Images

You can use your own icons on the `i` element, or use those provided by [FTC-ICONS](https://github.com/FTChinese/ftc-icons/).