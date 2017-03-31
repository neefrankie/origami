const cheerio = require('cheerio');

/*
 * @param {String} svg - svg file's content
 * @param {Object} setting
 * @param {String} setting.fill - requried. svg shape's fill color
 * @param {String} setting.background - optional. output file background color. If `null`, remove `<rect>` element
 * @param {String} - transformed svg string.
 */
function transform(svg, config) {
	$ = cheerio.load(svg, {
    xmlMode: true,
    decodeEntities: false
  });

	const backgroundEl = $('#background');
  const shapeEl = $('#shape');

	
	if (backgroundEl.length) {

		backgroundEl
			.attr('rx', config.rx)
			.attr('ry', config.ry)
			.attr('id', null);

		switch (config.background) {
			case null:
			 backgroundEl.remove();
			 break;

			case 'default':
				break;

			default:
				backgroundEl.attr('fill', config.background);
		}	
	}
	
	if (shapeEl.length) {

		switch (config.fill) {
			case 'default':
				break;

			default:
				shapeEl.attr('fill', config.fill);
		}

		shapeEl.attr('id', null);
	}

	return $.html();
}

module.exports = transform;