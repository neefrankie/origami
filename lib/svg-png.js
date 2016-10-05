const promisify = require('promisify-node')
const fs = promisify('fs');
const path = require('path');
const co = require('co');
const isThere = require('is-there');
const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const str = require('string-to-stream');
const svg2png = require('svg2png');
const chalk = require('chalk');
const socialList = require('../social-list.json');

const svgSrc = path.resolve(process.cwd(), 'svg');
const pngDest = path.resolve(process.cwd(), 'static/png');
const svgDest = path.resolve(process.cwd(), 'static/svg');

if (!isThere(pngDest)) {
	mkdirp.sync(pngDest);
}

if (!isThere(svgDest)) {
  mkdirp.sync(svgDest);
}

socialList.map((item) => {
	co(function *() {
    const iconName = item.name;
    const themes = item.themes;
    const themeNames = Object.keys(themes);

		const iconFile = `${svgSrc}/${iconName}.svg`;
    var svgString = '';

    try {
      svgString = yield fs.readFile(iconFile, 'utf8');
    } catch (e) {
      console.error(e);
    }

    themeNames.forEach((theme) => {
      const resultSvg =  transformSvg(svgString, themes[theme]);

      var resultName = (theme === 'default') ? iconName : `${iconName}-${theme}`;

      const svgFile = `${svgDest}/${resultName}.svg`;
      const pngFile = `${pngDest}/${resultName}.png`;

      const ws = fs.createWriteStream(svgFile);
      ws.on('finish', () => {
        console.log(`Generated: ${svgFile}`);
      });

      str(resultSvg)
        .pipe(ws);

      svg2png(Buffer.from(resultSvg))
        .then((buffer) => {
          return fs.writeFile(pngFile, buffer);
        }, e => {
          console.error(e.stack)
        })
        .then(() => {
          console.log(`Generated: ${pngFile}`);
        }, e => {
          consle.error(e.stack);
        });
    });
	})
	.then(function() {

	}, function(err) {
		console.error(err.stack);
	});
});

function transformSvg(svg, data) {
  $ = cheerio.load(svg, {
    xmlMode: true,
    decodeEntities: false
  });
  $('.foreground').attr('fill', data.foreground);

  if (data.background) {
    $('.background').attr('fill', data.background).attr('rx', data.rx).attr('ry', data.ry);
  } else {
    $('.background').remove();
  }
  return $.html();
}
