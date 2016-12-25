const path = require('path');
const fs = require('mz/fs');
const generateHtml = require('./dist/generateHtml.js');
/*
 * @param {Object} config - optional
 * @param {String} config.outDir - output directory.
 * @param {Array} config.links - social paltforms name.
 */
function share(config) {
	config = config === undefined ? {} : config;
	let out = config.outDir === undefined ? 'views' : config.outDir;

	out = path.resolve(process.cwd(), `${out}/o-share.html`);

	fs.writeFile(out, generateHtml(config), 'utf8')
		.then(() => {
			console.log(`${out} file is generated`);
		})
		.catch(err => {
			console.log(err);
		});
}

console.log(generateHtml({}));