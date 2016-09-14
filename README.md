## Front-end

To use the front scss and js, install with bower:
```
bower install ftc-footer --save
```
Set up you scss and js transpiler to search the `bower_components` directory.

To use the default data to build templates for front-end:
```
npm install ftc-footer --save-dev
```

`require` the package's exported data:
```
const ftcFooter = require('ftc-footer');
```
The data have two flavors: the complete data for `o-grid` enabled layout and a simple one made of inlined `<a>` tag.

```
const fullData = ftcFooter.full();
const simpleData = ftcFooter.simple();
```

Use the either of the data with `nunjucks`, together with the templates in the `partials` directory of this package.

