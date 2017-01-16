const fs = require('mz/fs');
const path = require('path');
const co = require('co');

const mkdir = require('./lib/mkdir.js');
const transform = require('./src/js/transform.js');
const output = require('./src/js/output.js');
const fav = require('./src/js/fav.js');
const settings = require('./src/js/settings.json');

const sourceDir = path.resolve(__dirname, 'svg');

function logos({dest='public/images', favicon=false}={}) {

	dest = path.resolve(process.cwd(), dest);

	if (favicon === true) {
		favicon = 'public/favicons';
	}

	settings.map(setting => {

		const svgName = setting.name;
		const themes = setting.themes;

		co(function *() {
			yield mkdir(dest);
			
			const svg = yield fs.readFile(`${sourceDir}/${svgName}.svg`, 'utf8');

			const themedSvgs = themes.map(theme => {
				return {
					name: theme.type === 'default' ? svgName : `${svgName}-${theme.type}`,
					body: transform(svg, theme)
				}
			});

			themedSvgs.forEach(svg => {
				output(svg.body, `${dest}/${svg.name}`);
			});

		})
		.catch(err => {
			console.log(err);
		});	

	});

	if (favicon) {
		const source = path.resolve(__dirname, 'svg/brand-ftc-logo-square.svg');
		const to = path.resolve(process.cwd(), favicon);

		mkdir(path.resolve(process.cwd(), favicon))
			.then(() => {
				return fav(source, to);
			})
			.catch(err => {
				console.log(err);
			});
	}
}

if (require.main === module) {
	logos({
		dest: 'dist',
		favicon: 'dist/favicons'
	});	
}

module.exports = logos;