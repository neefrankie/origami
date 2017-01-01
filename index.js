const path = require('path');
const fs = require('mz/fs');
const mkdir = require('./lib/mkdir.js');
const generateHtml = require('./lib/generateHtml.js');

/*
 * @param {Object} config - optional
 * @param {String} config.outDir - output directory.
 * @param {Array} config.links - social paltforms name.
 */
function share(config) {
	config = config === undefined ? {} : config;
	let destDir = config.outDir === undefined ? 'views/partials' : config.outDir;

	out = path.resolve(process.cwd(), `${destDir}/o-share.html`);

	return fs.access(destDir, fs.constants.R_OK | fs.constants.W_OK)
		.then(null, err => {
			return mkdir(destDir)
		})
		.then(() => {
			return fs.writeFile(out, generateHtml(config), 'utf8')
		})
		.then(() => {
			console.log(`Generated: ${out}`);
			return Promise.resolve();
		})
		.catch(err => {
			console.log(err);
		});
}

if (require.main === module) {
	share({
		outDir: 'partials',
		sprite: true
	});
}

module.exports = share;