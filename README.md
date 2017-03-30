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

### Sass

```scss
@import 'o-share/main';
```

We also support silent mode. So if you want to use all the default `o-share` classes, you need to set it to false:

```scss
$o-share-is-silent: false;
@import 'o-share/main';
```

If not, you can just use our mixins to set your custom class.

## API
### SCSS
#### Use predefined themes
```scss
@include oShare($themes: '', $sprite: false, $classname: 'o-share');
```

Parameters:
* {List} `$themes`. One of `('default', 'light', 'dark')`
* {Boolean} `$sprite` - Use svg sprite or not. Default to `false`.
* {String} `$classname` - Container's class name.

Default class names for each theme:
```css
.o-share--theme-default
.o-share--theme-light
.o-share--theme-dark
.o-share--sprite-default
.o-share--sprite-light
.o-share--sprite-dark
```

Examples:

Use the light theme:
```scss
@include oShare($themes: ('dark'));
```

Use defalt theme with svg sprite:
```
@include oShare(('default'), sprite: true);
```

When using svg sprite, you could set the icons's style as you like:
```scss
@include oShareBase;
.o-share__wechat {
  a {
    background-color: #609700;
    border: 1px solid #e6162d;
    radius: 5px;
    &:hover {
      background-color: #0977b6;
      opacity: 0.8;
    }
  }
  svg {
    fill: #3c5a99;
  }
}
```

#### Icon colors
Each icon has a default color sampled from its official logo. 
```sass
(
    "wechat": #609700,
    "weibo": #e6162d,
    "linkedin": #0977b6,
    "facebook": #3c5a99,
    "twitter": #6aa9e0
);
```

### JS

`oShare` accepted an optional config object which takes precedence over the `data` attributes set on the container:
```js
new Share(rootEl, config)
```

#### `rootEl`
{String | HTMLElement} rootEl - required

#### cofig
An object with:
* `links` {Array} - Optional. Determin which social platform to show. `null` for all. Default to `null`.
* `url` {String} - URL of the shared page. Default to `window.location.href`.
* `summary` {String} - Story summary
* `title` {String} - Page title
* `sprite` {Boolean | String} - Use svg sprite in HTML tag. Default to `false`. If set to `true`, `<svg>`element will be added with its `xlink:href` pointing to `/bower_components/ftc-social-images/dist/social-images-sprite.svg#<icon-name>.svg`. If a string provided, this string will replace the default path.

Examples:
```javascript
var config = {
    links: ['wechat', 'weibo', 'linkedin'],
    url: window.location.href,
    title: 'Syria oil map',
    summary: 'How the Isis oil economy works, explained through the journey of a barrel of oil in Syria',
    sprite: true
};

new Share(config)
```

If you do not pass the `config`, the script will first search `data` attributes of container for related infomation. If no `data` is specified, it will fallback to search `<meta>` tag with open graph attributes.
```html
// Same as config.title
<meta property="og:title" content="{{ pageTitle }}"/>
// Same as config.sumary
<meta property="og:description" content="{{ description }}" />
```

## Nunjucks Template
You can `include` the `partials/o-share.html` file in your template so that DOM structure was rendered on the server instead of on the client browser.

If you install `ftc-share` in `bower_components`, you can include `bower_components/ftc-share` in nunjucks search path, and include `partials/o-share.html` file:
```
{% include "partials/o-share.html" %}
```

Or you can install it as a to `node_modules` and generate the partial file to you project:
```js
const share = require('ftc-share');
share({
  outDir: 'views/partials',
  links: ['wechat', 'weibo', 'linkedin']
});
```

You also need to specify a `share` object in you template data:
```json
{
  "share": {
    "url": "http://www.ftchinese.com",
    "title": "Syria oil map",
    "summary": "How the Isis oil economy works, explained through the journey of a barrel of oil in Syria"
  }
}
```

This method does not rely on js. But you still need to use the sass mixin or wite css yourself.

## Image Service
```
https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Finteractive.ftchinese.com%2Fsocial-images%2Fwechat.svg?width=24&height=24&tint=a7a59b&format=png&source=ftchinese
```