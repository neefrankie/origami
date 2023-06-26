Generate FTC logos and favicons

## Node.js API

Installation
```
npm install @ftchinese/ftc-logos --save
```

### Generate Images

```js
const logoImages = require('ftc-logos');
logoImages(outDir='public/ftc-logos');
```

* `outDir` String. The destination directory you want to save the images. Default to `public/ftc-logos` of currently running node.js process.

### Get FT image service's url

```js
const logoImages = require('ftc-logos');
const url = logoImages.buildUrl(config)
```

`config` is an Object
* `name` String. SVG file name without extension. One of `brand-ftc-logo-round`, `brand-ftc-logo-square` or `brand-ftc-masthead`.
* `size` Number. Desired height of the the image.
* `format` String. `svg` or `png`.
* `tint` String. Optional. Hex color. Image shape's filling color. Could only be used on `brand-ftc-masthead`.

Example:

```js
const url = logoImages.buildUrl({
    name: 'brand-ftc-masthead',
    size: 100,
    format: 'png',
    tint: '#D75893'
});
// https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Finteractive.ftchinese.com%2Flogo-images%2Fbrand-ftc-masthead.svg?source=ftchinese&height=100&format=png&tint=%23D75893
```

## SCSS

Installation
```
bower install ftc-logos --save
```

### API

```scss
@import "ftc-logos/main";

// Function to get an image's url from FT image service
oLogosImageUrl($name, $size, $format, $tint:null);

// Mixins
@include oLogosGetImage($name, $tint:null, $apply-base-style: true)
```

