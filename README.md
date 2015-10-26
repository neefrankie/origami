#Share button API
## Usage
Create a new object by inheriting `Share`:

	var sharebutton = Object.create(Share);

Create share elements with `Share`'s `init()` method:

	sharebutton.init('.containerClassName');
	
## `Share.init()` signature:
	
	Share.init([rootEl, networks, configopt]);
	
`rootEl` is the share button's container. It could be either an id, class or HTMLElement but not a NodeList. This means you could use `getElementById` or `querySelector`,  but neither `getElementsByTagName` nor `querySelectorAll`. If you have multiple groups of the share button container, use a loop to initialize the `sharebutton` object multiple times yourself:

	var myshares = document.querySelectorAll('.share-links');
	var share = Object.create(Share);
	for (let i = 0; i < myshares.length; i++) {
		share.init(mysahres[i]);
	}
	
If you ommit this param, it will default to `document.body`.

'networks' is an optional array listing the social share networks:

	networks: [The social networks to share] 
	//Currently Available: 'wechat', 'weibo', 'linkedin'. Deafult to select all threee.

`config` is an object containing the information to present in the share button's href:
	
	var config = {
		url: //string. The url to share. Usually default to window.location.href.
		title: // string. The title to show when shared.
		summary: // string. A short messge to be shared
	}
	
Example:

	networks = ['wechat', 'weibo', 'linkedin'];
	var config = {
		url: window.location.href,
		title: 'Syria oil map',
		summary: 'How the Isis oil economy works, explained through the journey of a barrel of oil in Syria',
	};
	
If you do not pass the `networks` param, the script will first try to find wether the container element has a `data-o-share-links` atrribute. The simplest markup might look like the following:

	<div data-o-component="o-share"
	    data-o-share-links="{{networks}}">
	</div>
	
If `data-o-share-links` exists, it will get the value the that attribute and split the value into an array. If it failed to find this attribute, it will use a default array.

If you do not pass in the `config`, the script will search `<meta>` and `<title>` tag for related infomation. You should at leat provide a `meta` tag with the following attributes and values:

	<meta name="description" content="This will be used as the config.summary value" />

