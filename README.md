# FTC Social Share Component

## HTML

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

* `links`: List of lower case social networks to be added separated by a space, e.g. `data-o-share-links="wechat weibo"`. Values you could use: `wechat weibo linkedin facebook twitter`.
* `url`: The URL to be shared, e.g. `data-o-share-url="http://example.com"`.
* `title`: The title of the content to be shared, e.g. `data-o-share-title="FTC Share Component"`.
* `summary`: Summary text to be shared, e.g. `data-o-share-summary="This is the doumentation of ftc-share."`.

Those values could be set in JS constructor, which take precedence.

## JS

To instantiate the JavaScript:

```javascript
import Share from 'ftc-share';
new Share(rootEl, config);
```

* `rootEl` String | HTMLElement. The selector of containing HTML or the HTML element. If it is a string, the string will be passed to `querySelector`.
* `config` Object. Information needed for social share. Take precedence over those you set on HTML attributes.
  * `links` Array. An array of social platform names.
  * `url` String. To url to share.
  * `title` String. The title of the content to be shared.
  * `summary` String. Summary text to be shared.

`config` is the same as you set on HTML attributes in the preceding section, but takes precedence over HTML attributes. If you set neither of them, it will fallback to:

```js
{
  links: ['wechat', 'weibo', 'linkedin', 'facebook', 'twitter'],
  url: window.location.href || '',
  summary: document.querySelector('meta[property="og:description"]').getAttribute('content') : '',
  title: document.querySelector('meta[property="og:title"]').getAttribute('content') : ''
}
```

We use Open Graph Protocol set on `meta` tags.

The constructor will generate HTML markup in the `rootEl`. The generated markup has the following structure:

```html
<ul>
  <li class="o-share__action o-share__wechat">
    <a href="" title="分享到微信">
      <i>微信</i>
    </a>
  </li>
</ul>
```

If `rootEl` has children any child element, no markup will be generated. 

You can also instantiate all instances in your page by running the static method `Share.init()` which returns an array with all of them. If you use this method, make sure all the containing HTML has attribute `data-o-component="o-share"` set on it.

## SCSS

```css
@import 'o-share/main';
```

We also support silent mode. So if you want to use all the default `o-share` classes, you need to set it to false:

```css
$o-share-is-silent: false;
@import 'o-share/main';
```

If not, you can just use our mixins to set your custom class.

### Variables

That you could override:

* `$o-share-is-silent: true`
* `$o-share-icon-size: 24px`

### Mixins

#### `oShareBase`

```scss
@mixin oShareBase($classname: o-share)
```

`$classname` The class name of containg HTML. Default `o-share`.

Example:

```scss
@include oShare;
```

#### `oShareIcon`

```scss
@mixin oShareIcon(
$size: $o-share-icon-size,
$color: #fff,
$background: $o-share-colors,
$hover-color: null,
$border: null,
$classname: 'o-share')
```

* `$size` Icon's size.
* `$color` Icon's color.
* `$background` Icon's background color.
* `$hover-color` Icon's background color when hovered.
* `$border`. `true` will show one pixel rounded border.

#### `oSharePreset`

```scss
@mixin oSharePreset($theme: 'default', $classname: 'o-share')
```

`$theme` could be `default`, `light`, `dark`. Under the hood they are just calling `oShareIcon` with different settings.

### Example

You should at least include `oShareBase` and `oShareIcon` to have complte styles

```scss
@include oShareBase;
@include oShareIcon;
```

Or use the presets:

```scss
@include oShareBase;
@include oSharePreset($theme: 'dark');
```

### Icon colors

Each icon has a default color sampled from its official logo.

```scss
(
    "wechat": #609700,
    "weibo": #e6162d,
    "linkedin": #0977b6,
    "facebook": #3c5a99,
    "twitter": #6aa9e0
);
```

## Nunjucks Template

You can `include` the `partials/o-share.html` file in your template so that DOM structure was rendered on the server instead of on the client browser.

If you install `ftc-share` in `bower_components`, you can set `bower_components/ftc-share` in nunjucks search path, and include `partials/o-share.html` file:

```nunjucks
{% include "partials/o-share.html" %}
```

Or you can install it as a to `node_modules` and generate the partial file to you project:

```js
const produceHtml = require('ftc-share');
shareTemplate(options);
```

`options` is an object with:

* `links` Array. Social platforms you want to have.
* `destDir` String. Directory to put the partial file. Relative to the directory where you run the node.js process.
* Return a promise.

Example:

```js
produceHtml({
    links: ['wechat', 'weibo'],
    destDir: 'partials'
  })
  .catch(err => {
    console.log(err);
  });
```

You also need to specify a `share` object in you template data:

```js
{
  "share": {
    "inverse": true,
    "url": encodeURIComponent("http://www.ftchinese.com"),
    "title": "Syria oil map",
    "summary": "How the Isis oil economy works, explained through the journey of a barrel of oil in Syria"
  }
}
```

This method does not rely on js. Actually if you use it, JS constructor will stop silently. But you still need to use the sass mixin or wite css yourself.