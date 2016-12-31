## Usage
### SCSS API
* `socialImagesSetImageFor($social-name, $color: null, $container-width: 20, $container-height: null, $apply-base-styles: true)`
* `socialImagesSetSpriteFor($icon-name, $color: null, $width: 20, $height:null)`

## API
It can be used as a node module in you project.

```js
npm install social-images --save-dev
const socialImages = require('social-images');
```

### Syntax:
```
socialImages(config)
```

`config` Object.

* @param {Array} config.images - Default to ['wechat', 'weibo', 'linkedin', 'facebook', 'twitter']. You can use one or serveral of them.
* @param {String | Object} config.feature - one of ['default', 'round', 'pink'] or a custom object.
* @param {String} config.feature.fill - fill color for svg path. e.g. "#fff"
* @param {String} config.feature.background - background color for output image. e.g. "transparent"
* @param {String} config.feature.rx - radius of image. e.g. "50%"
* @param {String} config.feature.ry - radius of image.
* @param {String} config.dest - output directory. Default to `public/images` under `process.cwd()`

### Example:
```js
socialImages({
    names: ['wechat', 'weibo'],
    feature: 'pink'
    dest: 'client/images'
});
```
This will generate wechat and weibo images, with the "pink" theme, put in you project directory `client/images`.

You can also use custom styles:
```js
socialImages({
    feature: {
        fill: "#eeeeee",
        background: "#2bbbbf",
        rx: "10px",
        ry: "10px"
    }
});
```

## Commands
### Generate all svg and png files

`src/js/settings.json` specifies what kind of images will be generated. Each image may have different fill color, background color and radius. The `themes` field corresponds to these specifications. To generated all svg and png file:
```
npm run buildall
// or
node index.js
```

### Generate a single svg and png file with custom style
```
npm run buildone -- -i=image-name -b=background-color -f=fill-color -x=radius-x -y=radius-y
```

All arguments are optional. If omitted, it will generate the default images.

## Gulp tasks
- `gulp svgmin`
- `gulp templates`
- `gulp svgstore`
