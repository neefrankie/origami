## Usage

## Commands
### Generate all svg and png files

`social-list.json` specifies what kind of images will be generated. Each image may have different requirements as to their shape and background color. The `themes` field corresponds to these specifications. To generated all svg and png file as specified by this file:
```
npm run svgpng
```

### Generate the svg and png of a single image
```
npm run single -- -i=image-name -b=background-color -f=foreground-color -x=radius-x -y=radius-y -o=outputname
```

All arguments are optional. Omitted args will default to the svg's original setting.

## Gulp tasks
- `gulp svgmin`
- `gulp templates`
- `gulp svgstore`
- `gulp sassvg`
