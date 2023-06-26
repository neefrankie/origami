const { resolve } = require('path');
const favicons = require('favicons');
const { promisify } = require('util');
const { writeFile, mkdir } = require('fs').promises;

const promiseFavicons = promisify(favicons);

const config = {
	appName: null,                  // Your application's name. `string` 
	appDescription: null,           // Your application's description. `string` 
	developerName: null,            // Your (or your developer's) name. `string` 
	developerURL: null,             // Your (or your developer's) URL. `string` 
	background: "#FFCC99",             // Background colour for flattened icons. `string` 
	path: `http://interactive.ftchinese.com/favicons`,                      // Path for overriding default icons path. `string` 
	display: "standalone",          // Android display: "browser" or "standalone". `string` 
	orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string` 
	start_url: "/?homescreen=1",    // Android start application's URL. `string` 
	version: "1.0",                 // Your application's version number. `number` 
	logging: true,                 // Print logs to console? `boolean` 
	online: false,                  // Use RealFaviconGenerator to create favicons? `boolean` 
	preferOnline: false,            // Use offline generation, if online generation has failed. `boolean` 

  icons: {
    android: true,              // Create Android homescreen icon. `boolean`
    appleIcon: true,            // Create Apple touch icons. `boolean`
    appleStartup: false,         // Create Apple startup images. `boolean`
    coast: false,                // Create Opera Coast icon. `boolean`
    favicons: true,             // Create regular favicons. `boolean`
    firefox: false,              // Create Firefox OS icons. `boolean`
    opengraph: true,            // Create Facebook OpenGraph image. `boolean`
    twitter: false,              // Create Twitter Summary Card image. `boolean`
    windows: true,              // Create Windows 8 tile icons. `boolean`
    yandex: false                // Create Yandex browser icon. `boolean`
  }
};

/**
 * @typedef {Object} Image
 * @property {string} name
 * @property {Buffer} contents
 * 
 * @typedef {Object} File
 * @property {string} name
 * @property {string} contents
 * 
 * @typedef {Object} Response
 * @property {Image[]} images
 * @property {File[]} files
 * @property {string[]} html
 * 
 * @param {string} inFile - input svg file
 * @param {string} outDir - output directory.
 */
async function generate(inFile, outDir) {

  await mkdir(outDir, { recursive: true });
  
  /**
   * @type Response
   */
  const response = await promiseFavicons(inFile, config);

  const promisedWrite = response.images.map(image => {
    console.log(`Saving ${image.name}`);

    const outFile = resolve(outDir, image.name);

    return writeFile(outFile, image.contents);
  });

  promisedWrite.push(
    writeFile(
      resolve(outDir, 'favicons.html'), 
      response.html.join('\n')
    )
  );

  await Promise.all(promisedWrite);
}

if (require.main == module) {
  const inFile = resolve(__dirname, '../assets/logos/brand-ftc-logo-square.svg');
  const outDir = resolve(process.cwd, 'public/favicons')

	generate(inFile, outDir)
		.catch(err => {
			console.log(err);
		});
}
