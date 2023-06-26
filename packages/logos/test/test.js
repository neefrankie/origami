const fs = require('mz/fs');
const path = require('path');
const transform = require('../src/js/transform.js');
const settings = require('../src/js/settings.json');

const fileName = path.resolve(process.cwd(), 'svg/brand-square.svg');

fs.readFile(fileName)
	.then(content => {
		const svg = transform(content, settings[0].themes[0]);
		console.log(svg);
	})
	.catch(err => {
		console.log(err);
	});