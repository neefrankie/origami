const fs = require('mz/fs');
const path = require('path');
const favicons = require('favicons');
const config = {
	appName: null,                  // Your application's name. `string` 
	appDescription: null,           // Your application's description. `string` 
	developerName: null,            // Your (or your developer's) name. `string` 
	developerURL: null,             // Your (or your developer's) URL. `string` 
	background: "#FFCC99",             // Background colour for flattened icons. `string` 
	path: "/",                      // Path for overriding default icons path. `string` 
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
    opengraph: false,            // Create Facebook OpenGraph image. `boolean`
    twitter: false,              // Create Twitter Summary Card image. `boolean`
    windows: false,              // Create Windows 8 tile icons. `boolean`
    yandex: false                // Create Yandex browser icon. `boolean`
  }
};

function promisifyFavicons(source, config) {
	return new Promise((resolve, reject) => {
		favicons(source, config, (error, results) => {
			error === null ? resolve(results.images) : reject(error);
		});
	});
}

function fav(source, to) {
	return promisifyFavicons(source, config)
		.then(images => {
			return Promise.all(images.map(image => {
				return fs.writeFile(`${to}/${image.name}`, image.contents);
			}));
		})
		.catch(e => {
			console.log(e);
		});	
}

if (require.main == module) {
	const source = path.resolve(__dirname, '../../svg/brand-ftc-logo-square.svg');
	const to = path.resolve(process.cwd(), '.tmp')
	fav(source, to);
}

module.exports = fav;