const cheerio = require('cheerio');

/*
 * @param {String} svg - svg file's content
 * @param {Object} setting
 * @param {String} setting.fill - requried. svg shape's fill color
 * @param {String} setting.background - optional. output file background color. If `null`, remove `<rect>` element
 * @param {String} - transformed svg string.
 */
function transform(svg, setting) {
	$ = cheerio.load(svg, {
    xmlMode: true,
    decodeEntities: false
  });

	const rectEl = $(setting.rect ? setting.rect : '#background');
  const pathEl = $(setting.path ? setting.path : '#path');
	
	if (rectEl.length) {
		setting.background
			? rectEl
				.attr('fill', setting.background)
				.attr('rx', setting.rx)
				.attr('ry', setting.ry)
				.attr('id', null)
			: rectEl.remove();	
	} else {
		console.log('No background element');
	}
	
	if (pathEl.length) {
		setting.fill
		 ? pathEl
		 		.attr('fill', setting.fill)
		 		.attr('id', null)
		 : console.log('Fill color not specified.');
	} else {
		console.log('No path element.');
	}

	return $.html();
}

module.exports = transform;