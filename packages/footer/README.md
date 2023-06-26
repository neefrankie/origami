Installation:
```
bower install ftc-footer --save
npm install @ftcinese/ftc-footer --save
```

## API
### JS
For node.js only. **NOT** for frontend. Used to get the json data to render nunjucks template.

```js
const getFooterData = require('@ftchinese/ftc-footer');
const footer = getFooterData(options)
```

`options` is an object with the following fields:
* `theme`. A string specifying the theme to use. Could be `theme-dark` or `theme-light`. Default `theme-dark`.
* `type` A string specifying which group of data you want to use. Could be `matrix` or `simple`.
* Returns an object.

### Nunjucks
Specify the path to the partial file:

```js
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(
    [
// the path pointing to you current project's view dir.
      path.resolve(process.cwd(), 'views'),
// the path pointing to ftc-footer partial file in you installed it via bower      
      path.resolve(process.cwd(), 'bower_components/ftc-footer'),
// Or if you installed via npm
      path.resolve(process.cwd(), 'node_modules/@ftchinese/ftc-footer')      
    ],
    {noCache: true}
  ),
  {autoescape: false}
);
```

Then in your template file:
```
{% include "o-footer.html" %}
// or if you prefer the 'simple' one:
{% include "o-footer-simple.html" %}
```

### SCSS
Use the default style:
```scss
$o-footer-is-silent: false;
@import "ftc-footer/main";
```
The container's defaut clas name is `o-footer`

Or you can use your own classname:
```scss
@import "ftc-footer/main";
@include oFooterBase($classname: 'my-footer');
@include oFooterMatrix($classname: 'my-footer');
@include oFooterSimple($classname: 'my-footer');
```
