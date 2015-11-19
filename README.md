# Installation

	bower install ftc-share --save

# Usage
Create a new object by inheriting `Share`:

	var sharebutton = Object.create(Share);

Create share elements with `Share`'s `init()` method:

	sharebutton.init('.containerClassName');

## `Share.init()` signature:

	
	Share.init([rootEl, socialList, configopt]);

`rootEl` is the share button's container. It could be either an id, class or HTMLElement but not a NodeList. This means you could use `getElementById` or `querySelector`,  but neither `getElementsByTagName` nor `querySelectorAll`. If you have multiple groups of the share button container, use a loop to initialize the `sharebutton` object multiple times yourself:

	var myshares = document.querySelectorAll('.share-links');
	var share = Object.create(Share);
	for (let i = 0; i < myshares.length; i++) {
		share.init(mysahres[i]);
	}

If you ommit this param, it will default to `document.body`.

`socialList` is an optional array listing the social share platforms. Currently Available: 'wechat', 'weibo', 'linkedin'. Deafult to select all threee.

If you do not pass in the `socialList` param, the script will first try to find wether the container element has a `data-o-share-links` atrribute. The simplest markup might look like the following:

	<div data-component="ftc-share"
	    data-share-links="{{networks}}">
	</div>
	

If `data-share-links` exists, it will get the value of this attribute and split the value into an array. If it failed to find this attribute, a default array will be used.

`config` is an object containing the information used as the share button's `href` value:
	
	var config = {
		url: //string. The url to share. Usually default to window.location.href.
		title: // string. The title to show when shared.
		summary: // string. A short messge to be shared
	}
	

If you do not pass in the `config`, the script will search `<meta>` and `<title>` tag for related infomation. You should at leat provide a `meta` tag with the following attributes and values in your HTML file:

	<meta name="description" content="This will be used as the config.summary value" />

# Example:

##HTML:

	<div class="share-links"></div>

##Script:

	var socialList = ['wechat', 'weibo', 'linkedin'];
	var config = {
		url: window.location.href,
		title: 'Syria oil map',
		summary: 'How the Isis oil economy works, explained through the journey of a barrel of oil in Syria',
	};
	var share = Object.create(Share)
	share.init('.share-links', socialList, config);
	

# Generated HTML Structure

	<ul>
        <li>
        	<a class="share-link share-wechat" href="" target="_blank">
        		<i class="icon-social-wechat"></i>
        		<span>微信</span>
        	</a>
        </li>
        <li>
        	<a class="share-link share-weibo" href="" target="_blank">
        		<i class="icon-social-weibo"></i>
        		<span>微博</span>
        	</a>
        </li>
        <li>
        	<a class="share-link share-linkedin" href="" target="_blank">
        		<i class="icon-social-linkedin"></i>
        		<span>LinkedIn</span>
        	</a>
        </li>
    </ul>

# Background Images

You can use your own icons on the `i` element, or use this project together with [FTC-ICONS](https://github.com/FTChinese/ftc-icons/).