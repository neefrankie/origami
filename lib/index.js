/*
 * read file
 * transform svg
 * convert svg to png
 * write file 
 */
/*
socialImages({
  names: ['wechat', 'weibo'],
  feature: {
    foreground: '#fff',
    background: '#000'
  }
  dest: 'public/images'
});
*/
const fs = require('mz/fs');
const path = require('path');
const co = require('co');
const isobject = require('isobject');
const kindof = require('kind-of');

const filter = require('./src/js/filter.js');
const transform = require('./src/js/transform.js');
const output = require('./src/js/output.js');

const settings = require('./src/js/settings.json');
const defaultNames = settings.map(setting => {
	return setting.name;
});

const sourceDir = path.resolve(__dirname, 'svg');
/*
 * @param {Object} config - optional
 * @param {Array} config.images - one or more of ['wechat', 'weibo', 'linkedin', 'facebook', 'twitter']
 * @param {String | Object} config.feature - one of ['default', 'round', 'pink'] or a custom object.
 * @param {String} config.feature.fill - fill color for svg path. e.g. "#fff"
 * @param {String} config.feature.background - background color for output image. e.g. "transparent"
 * @param {String} config.feature.rx - radius of image. e.g. "50%"
 * @param {String} config.feature.ry - radius of image.
 * @param {String} config.dest - output directory. Default to `public/images` under `process.cwd()`
 */
function socialImages({names=defaultNames, feature='round', dest='public/images'}={}) {

	const allowedType = [
		'null',
		'string',
		'object'
	];

	if (!allowedType.includes(kindof(feature))) {
		return new Error('feature could only be `string` or a plain object');
	}
// check if passed in names are allowed.
	names.forEach(name => {
		if (!defaultNames.includes(name)) {
			return new Error(`Image ${name} is not defined in ftc-social-images`);
		}
	});

	console.log(`Using feature: ${feature ? feature.toString() : 'all'}`);
	dest = path.resolve(process.cwd(), dest);

	return co(function *() {
		yield mkdir(dest);
		const images = settings.filter(setting => {
			return names.includes(setting.name);
		});
// Load svg files and merge svg string into settings entry.
		yield Promise.all(images.map(image => {
			return fs.readFile(`${sourceDir}/${image.name}.svg`, 'utf8')
				.then(body => {
					return Object.assign(image, {body: body});
				});
		}));

		for ({name, themes, body} of images) {

			const themesToUse = filter(themes, feature);
// Output all variants for current `name`.
			for (let theme of themesToUse) {
				const svgOut = transform(body, theme);
// If theme.name is null, or `default`, output file name is `wechat`, otherwise it's `wechat-round` or `wechat-pink`.
				const fileName = (!theme.name || theme.name === 'default')
					? name 
					: `${name}-${theme.name}`;

				output(svgOut, `${dest}/${fileName}`);
			}			
		}
	})
	.catch(err => {
		console.log(err);
	});	
	
}

if (require.main === module) {
	socialImages({
		feature: null,
		dest: 'dist'
	});	
}

module.exports = socialImages;