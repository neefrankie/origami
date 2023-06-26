# FTC Social Share Component

Version 4.0 is a breaking change from previous relsease. In this version JS is no longer relied on. Instead, we try to built everything static.

## Usage

In your nunjucks setting, add a search path `$CWD/node_modules/@ftchinese`.

### Simple way

Then include a template file `{% include "ftc-share/dist/o-share.html" %}`. In the render context provide a field `share` (See below the data strcuture).

Done. The included partial file has already inlined CSS and JS assets. And the JS function has already been initialized.

### Manual way

If you prefer to build assets yourself, then include template file `{% inlcude "ftc-share/views/partials/o-share.html" %}`. Provide a field `share` the same way above.

Import `main.js` and `main.scss`. How you import them depends on you build/bundl tools.

For JS you have to initialize it: `new Share()`

For SCSS, you have to set `$o-share-is-silent: false` before importing `main.scss`.

## `share` data

In the data to render nunjucks template, specify a field `share`:

```js
share: {
  inverse: true | false,
  title: encodeURIComponent("Article tile to show"),
  url: encodeURIComponent("http://interactive.ftchinese.com/components/ftc-share.html"),
  summary: encodeURIComponent("A short summary of the content to share")
}
```

## Custom Template

The nunjuck template you include from this module provide social platforms of `wechat, weibo, linkedin, facebook, twitter`. If you do not want to show all of them, you can generate your own partial files. In a node.js file:

```js
const { resolve } = require('path');
const Share = require('ftc-share');
const share = new Share(['wechat', 'weibo']);
// this will generate an HTML-only template
share.buildPartial('views/partials/o-share.html'));
  .catch(err => {
    console.log(err);
  });
// this will generate the template with inlined css and js
share.buildBundle('views/partials/o-share-bundle.html')
  .catch(err => {
    console.log(err);
  });
```
