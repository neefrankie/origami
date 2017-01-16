const fs = require('mz/fs');
const svg2png = require('./svg2png.js');

function output(svg, to) {
	console.log(`Generating ${to}.svg`);

	fs.writeFile(`${to}.svg`, svg, 'utf8')
		.catch(err => {
			console.log(err);
		})

	svg2png(svg)
		.then(buffer => {
			console.log(`Generating ${to}.png`);
			return fs.writeFile(`${to}.png`, buffer)
		})
		.catch(err => {
			console.log(err);
		});	
}

module.exports = output;