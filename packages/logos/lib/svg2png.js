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
	const dest = path.resolve(__dirname, '../.tmp/brand-ftc-logo-square.png');
	fs.readAsync(`${svgDir}/brand-ftc-logo-square.svg`)
		.then(svg => {
			return svg2png(svg, dest);
		})
		.catch(err => {
			console.log(err);
		});
}

module.exports = svg2png;