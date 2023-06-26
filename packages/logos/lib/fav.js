const fs = require('fs-jetpack');
const pify = require('pify');
const path = require('path');
const favicons = require('favicons');
const baseDir = require('./base-dir.js');
const source = path.resolve(__dirname, '../svg/brand-ftc-logo-square.svg');

const config = {
	appName: null,                  // Your application's name. `string` 
	appDescription: null,           // Your application's description. `string` 
	developerName: null,            // Your (or your developer's) name. `string` 
	developerURL: null,             // Your (or your developer's) URL. `string` 
	background: "#FFCC99",             // Background colour for flattened icons. `string` 
	path: `http://interactive.ftchinese.com/${baseDir.favicons}`,                      // Path for overriding default icons path. `string` 
	display: "standalone",          // Android display: "browser" or "standalone". `string` 
	orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string` 
	start_url: "/?homescreen=1",    // Android start application's URL. `string` 
	version: "1.0",                 // Your application's version number. `number` 
	logging: true,                 // Print logs to console? `boolean` 
	online: false,                  // Use RealFaviconGenerator to create favicons? `boolean` 
	preferOnline: false,            // Use offline generation, if online generation has failed. `boolean` 

  icons: {
    android: false,              // Create Android homescreen icon. `boolean`
    appleIcon: true,            // Create Apple touch icons. `boolean`
    appleStartup: false,         // Create Apple startup images. `boolean`
    coast: false,                // Create Opera Coast icon. `boolean`
    favicons: true,             // Create regular favicons. `boolean`
    firefox: false,              // Create Firefox OS icons. `boolean`
    opengraph: true,            // Create Facebook OpenGraph image. `boolean`
    twitter: false,              // Create Twitter Summary Card image. `boolean`
    windows: false,              // Create Windows 8 tile icons. `boolean`
    yandex: false                // Create Yandex browser icon. `boolean`
  }
};

/*
 * @param {String} imageDir - Dir to save favicons
 * @param {String | null} htmlDir - Dir to save html files of meta tags listing favicons. If `null`, do not generate it.
 * @param {String} url - override config.path
 */

async function fav({imageDir=`public/${baseDir.favicons}`, htmlDir='views/partials', url}={}) {
	const imageDest = path.resolve(process.cwd(), imageDir);
	config.path = url ? url : config.path;
	try {
		const result = await pify(favicons)(source, config);

		const promisedWrite = result.images.map(image => {
			console.log(`Saving ${image.name}`);
			return fs.writeAsync(`${imageDest}/${image.name}`, image.contents);
		});

		if (htmlDir !== null) {
	// Generate the html partial file of meta tag.
			const htmlDest = path.resolve(process.cwd(), `${htmlDir}/meta-favicons.html`);
			promisedWrite.push(fs.writeAsync(`${htmlDest}`, result.html.join('\n')));
		}

		await Promise.all(promisedWrite);
	} catch (e) {
		throw e;
	}
}

if (require.main == module) {
	fav({
			htmlDir: 'public/favicons'
		})
		.catch(err => {
			console.log(err);
		});
}

module.exports = fav;