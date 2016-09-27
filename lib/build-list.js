const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const co = require('co');
const str = require('string-to-stream');

const helper = require('./helper');

co(function *() {
  const files = yield helper.readDir('svg');
  const names = files.map(file => path.basename(file, '.svg'));

  const svgs = yield Promise.all(files.map(helper.readFile));

  const svgData = svgs.map(extractSvg);

  const list = names.map((name, i) => {
    return Object.assign({name: name}, svgData[i]);
  });

  str(JSON.stringify(list, null, 4))
    .pipe(fs.createWriteStream('icon-list.json'))
})
.then(() => {

}, (e) => {
  console.error(e.stack);
});

function extractSvg (svg) {
  $ = cheerio.load(svg, {
    xmlMode: true,
    decodeEntities: false
  });

  const rectEl = $('rect');
  var background = rectEl.attr('fill');
  background = background ? background : null;

  var rx = rectEl.attr('rx');
  rx = rx ? rx : null;

  var ry = rectEl.attr('ry');
  ry = ry ? ry : null;

  var foreground = $('path').attr('fill');
  foreground = foreground ? foreground : null;

  return {
    foreground: foreground,
    background: background,
    rx: rx,
    ry: ry
  };
}
