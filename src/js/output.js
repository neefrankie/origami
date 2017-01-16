const fs = require('mz/fs');
const convert = require('./convert.js');

/*
 * @param {String} svg - Input string of the svg content
 * @param {String} to - Destination filename.
 */
function output(svg, to) {
	console.log(`Generating ${to}.svg`);

	fs.writeFile(`${to}.svg`, svg, 'utf8')
		.catch(err => {
			console.log(err);
		})

	convert(svg)
		.then(buffer => {
			console.log(`Generating ${to}.png`);
			return fs.writeFile(`${to}.png`, buffer)
		})
		.catch(err => {
			console.log(err);
		});
}

module.exports = output;
