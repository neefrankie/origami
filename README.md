Social media and URL sharing buttons modified from Financial Times o-share component.

- Provides the ability to share a URL provided by the product
- Uses a standard set of social media icons.
- Provides a copyable representation of a link

## Getting started

The simplest markup you might need looks like this:

```html
<div data-o-component="o-share"
    class="o-share"
    data-o-share-links="{{links}}"
    data-o-share-url="{{url}}"
    data-o-share-title="{{title}}"
    data-o-share-summary="{{summary}}">
</div>
```

The different options are:

* `links`: List of lower case social networks to be added separated by a space.
* `url`: The URL to be shared.
* `title`: The title of the content to be shared
* `summary`: Summary text to be shared.

The different social networks are (in the order frequency used in China):

* Wechat
* Weibo
* Linkedin
* Facebook
* Twitter

You can take a look at the example by running `gulp serve`.

### Javascript
To instantiate the JavaScript:

```javascript
import Share from 'ftc-share'
var shareInstance = new Share(document.querySelector('[data-o-component=o-share]'));
```

The markup will be generated for that instance of `o-share`. The generated markup has the following structure:
```html
<ul>
    <li class="o-share__action o-share__wechat">
        <a href="" title="分享到微信">
            <i>微信</i>
        </a>
    </li>
</ul>
```

You can also instantiate all instances in your page by running the static method `Share.init` which returns an array with all of them.

You can also use in the `script` tag of you HTML the compiled version for browsers in the directory `dist`. It has no external dependency and you can use it directly:

```
<script src="ftc-share/dist/ftc-share.js" />
```

### Events

This module will trigger the following events on its root element:

* `oShare.ready` - when a share links behaviour has been initialised
* `oShare.open` - when a share link has been opened (popup/flyout opened as a result of button click)
* `oShare.copy` - when the URL has been copied

### Sass

```scss
@import 'o-share/main';
```

We also support silent mode. So if you want to use all the default `o-share` classes, you need to set it to false:

```scss
$o-share-is-silent: false;
@import 'o-share/main';
```

If not, you can just use our mixins to set you custom class.

## SASS API
Each icon has a default color sampled from its official logo. You can override this variable to set your own color scheme: 
```sass
$o-share-icon-palette: (
    "wechat": #609700,
    "weibo": #e6162d,
    "linkedin": #0977b6,
    "facebook": #3c5a99,
    "twitter": #6aa9e0
) !default;
```

### Themes

Serveral predefined themes were provided: `default`, `light`, `dark`. To use them add a class name `class="o-share--theme-<default | light | dark>"` to the outmost container.

### Custom themes
If you want to set the icons' color, background, borders, hovered state and size to whaterever you like, use these mixins:

- `@mixin oShareSetIcons($foreground)` Set the icon's shape for each link using `sassvg`. But you'd better first disable `oShareBase` using the default icon by passing `$include-icon:false`. Otherwise the icon's svg code might be include multiple times resuting a large css file.

- `@mixin oShareSetBackground($background)` Set the icon's background color.

- `@mixin oShareSetHover($hover)` Background color when hovered.

- `@mixin oShareSetBorder($border: null, $radius: null)` Set border and border-radius.

- `@mixin oShareSetLinkPadding($padding)` The gap between the icon shape and the edege of the link.

- `@mixin oShareSetIconSize($width, $height:null)` The size of icon.

### Use a svg symbol
By default `ftc-share` uses svg as icon image. Each icon's svg source code was directly put into compiled css file. If you need the same icon on the same page with differnet colors, you have to include the same icon's svg code multiple times to have a diffence `fill` property on the icon. This is inefficient could bloat up you file.

To solve this problem, you can use svg symbol technique, which is similar to binary image's "sprite". One advantage is that you can set the image's color easily in you css with `fill: <color>`

To use the default svg themes, add class to the container like `class="o-share--symbol-<default | light | dark | tint>`.

The above mentioned mixins coulde also be used here execept `@mixin oShareSetIcons($foreground)` which is needless since you do not need to inline the svg code.

## JS API

`oShare` accepted an optional config object which takes precedence over the `data` attributes set on the container:

```javascript
var config = {
    links: ['wechat', 'weibo', 'linkedin'],
    url: window.location.href,
    title: 'Syria oil map',
    summary: 'How the Isis oil economy works, explained through the journey of a barrel of oil in Syria',
};
```

If you do not pass the `config`, the script will first search `data` attributes of container for related infomation. If no `data` is specified, it will use an internal fallback config object, which searched `meta` tag on the page used as open graph for `summary` and `<title>` value for `title`. You should at leat provide a `meta` tag with the following attributes and values in your HTML file:

```html
<meta property="og:description" content="summary of the article" />
```