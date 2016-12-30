const path = require('path');
const minimist = require('minimist');
const socialImages = require('./index.js');
const options = {
	string: ['input', 'background', 'foreground', 'rx', 'ry'],
	alias: {
		i: 'input',
		b: 'background',
		f: 'fill',
		x: 'rx',
		y: 'ry'
	},
	default: {
		fill: '#000',
		background: null,
		rx: null,
		ry: null
	}
}
const argv = minimist(process.argv.slice(2), options);

console.log(argv);

socialImages({
	names: [argv.i],
	feature: {
		name: null,
		fill: argv.f,
		background: argv.b,
		rx: argv.rx,
		ry: argv.ry
	},
	dest: path.resolve(process.cwd(), '.tmp')
})