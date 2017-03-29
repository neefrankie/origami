const cheerio = require('cheerio');

/* Convert an svg's style using `setting`
 * @param {String} svg - svg file's content
 * @param {Object} setting
 * @param {String} setting.fill - requried. svg shape's fill color
 * @param {String} setting.background - optional. output file background color. If `null`, remove `<rect>` element
 * @param {String} - transformed svg string.
 */
function transform(svg) {
	$ = cheerio.load(svg, {
    xmlMode: true,
    decodeEntities: false
  });

	$('#background')
		.remove();
  $('#path')
		.removeAttr('fill')
		.removeAttr('id');

	return $.html();
}

if (require.main === module) {
	const fs = require('fs-jetpack');
	const path = require('path');
	const junk = require('junk');
	const svgDir = path.resolve(__dirname, '../svg');
	fs.listAsync(svgDir)
		.then(files => {
			console.log(files);
			console.log(files.filter(junk.not));
		})
		.catch(err => {
			console.log(err);
		});
}

module.exports = transform;
