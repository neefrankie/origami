const fs = require('fs-jetpack');
const sharp = require('sharp');
const path = require('path');
const svgDir = path.resolve(__dirname, '../svg');
/*
 * @param {String} input - svg content
 * @param {String} dest - output file directory
 * @return {Promise}
 */
function svg2png(input, dest) {
	return sharp(Buffer.from(input))
		.png()
		.toBuffer()
		.then((buffer) => {
			return fs.writeAsync(dest, buffer);
		})
		.catch(err => {
			throw err;
		});
}

if (require.main === module) {
	const dest = path.resolve(__dirname, '../.tmp/wechat.png');
	fs.readAsync(`${svgDir}/wechat.svg`)
		.then(svg => {
			return svg2png(svg, dest);
		})
		.catch(err => {
			console.log(err);
		});
}

module.exports = svg2png;