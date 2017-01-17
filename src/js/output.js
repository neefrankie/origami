const fs = require('mz/fs');
const SVGO = require('svgo');
const svgo = new SVGO();
const svg2png = require('./svg2png.js');

function output(svg, to) {
	console.log(`Generating ${to}.svg`);

	svgo.optimize(svg, (result) => {
		fs.writeFile(`${to}.svg`, result.data, 'utf8')
			.catch(err => {
				console.log(err);
			})

		svg2png(result.data)
			.then(buffer => {
				console.log(`Generating ${to}.png`);
				return fs.writeFile(`${to}.png`, buffer)
			})
			.catch(err => {
				console.log(err);
			});			
	});
}

module.exports = output;