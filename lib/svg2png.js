const fs = require('fs-jetpack');
const path = require('path');
const sharp = require('sharp');

const svgDir = path.resolve(__dirname, '../svg');
/*
 * @param {String} input - path to svg file
 * @param {String} dest - output file directory
 * @return {Promise}
 */
function svg2png(input, dest) {
	const filename = path.basename(input, '.svg');
	const output = `${dest}/${filename}.png`;
	return sharp(`${svgDir}/${input}`)
		.png()
		.toBuffer()
		.then((buffer) => {
			return fs.writeAsync(output, buffer)
		})
		.catch(err => {
			throw err;
		});
}

if (require.main === module) {
	const junk = require('junk');
	
	fs.listAsync(svgDir)
		.then(files => {
			return files.filter(junk.not);
		})
		.then(svgs => {
			return Promise.all(svgs.map(svg => {
				const dest = path.resolve(__dirname, '../public');
				return svg2png(svg, dest)
			}));
		})
		.catch(err => {
			console.log(err);
		});
}

module.exports = svg2png;