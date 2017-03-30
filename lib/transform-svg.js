const cheerio = require('cheerio');

/* Transform an svg's with its path filled with `color`
 * @param {String} svg - svg file's content
 * @param {String | null | undefined} color - Optional. Hex or keyword color. `null` removes color on path element. `undefined` keeps default color.
 * @pram {String | null | undefined} background - Same as `color`.
 * @return {String} - transformed svg string.
 */
function transform(svg, color, background) {
	const $ = cheerio.load(svg, {
    xmlMode: true,
    decodeEntities: false
  });

	const pathEl = $('#path');
	const backgroundEl = $('#background');

	if (typeof color !== 'undefined') {
		pathEl.attr('fill', color)
	}
	pathEl.removeAttr('id');

// If `background` color is null, remove background.
	if (background === null) {
		backgroundEl.remove();
	}

// If `background` is a string, we assume you are trying to set a color on the background
	if (typeof background === 'string') {
		backgroundEl.attr('fill', background)
	}

// If `background` is not set, do nothing. Just remove id.
	backgroundEl.removeAttr('id');

	return $.html();
}

if (require.main === module) {
	const fs = require('fs-jetpack');
	const path = require('path');
	const source = path.resolve(__dirname, '../svg/wechat.svg');
	const dest = path.resolve(__dirname, '../.tmp/wechat.svg');
	fs.readAsync(source)
		.then(svg => {
			return transform(svg, null, null);
		})
		.then(svg => {
			return fs.writeAsync(dest, svg);
		})
		.catch(err => {
			console.log(err);
		});
}

module.exports = transform;
