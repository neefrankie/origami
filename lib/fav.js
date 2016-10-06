const promisify = require('promisify-node')
const fs = promisify('fs');
const path = require('path');
const isThere = require('is-there');
const mkdirp = require('mkdirp');
const favicons = require('favicons');

const source = path.resolve(process.cwd(), 'static/svg/brand-square.svg');
const destDir = path.resolve(process.cwd(), 'static/favicons');
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

if (!isThere(destDir)) {
	mkdirp.sync(destDir);
}

favicons(source, config, (error, response) => {
	if (error) {
		console.log(error.status);
		console.log(error.name);
		console.log(error.message);
	}
	response.images.forEach(image => {
		const dest = `${destDir}/${image.name}`;
		fs.writeFile(dest, image.contents)
			.then(() => {
				console.log(`Done: ${image.name}`)
			}, e => {
				console.error(e.stack);
			});
	});
});