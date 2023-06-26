Generate social platform images.

## Installation

```
npm install @ftchinese/social-images --save-dev
```

## API

For node.js only. NOT frontend js.

```js
socialImages(options)
```

`options` is an object with:

* `to` String. Destination directory relative to node.js running process. Default `public/social-images`.
* `png` Boolean. Also produce png files when generating svg. Default `true`.
* `color` String | null. Optional. Color to draw the icon. `null` removes any color, and SVG without filling color is black. If omitted, use the icon's default color `#fff`.
* `background` String | null. Optional. Color set on icon's background. `null` removes the background. If omitted, use the icon's official color.
* Returns promise.

## Example

```js
socialImages({
    to: 'social-images', // path.resolve(process.cwd(), 'social-images')
    png: false, // do not generate png files. Only svg.
    color: '#a7a59b',
    background: null // removes background
  })
  .catch(err => {
    console.log(err);
  });
```