import { resolve } from 'node:path';
import { favicons, FaviconOptions } from 'favicons';
import { writeFile } from 'node:fs/promises';
import { mkDirDist } from './dir';

const config: FaviconOptions = {
	appName: null,                  // Your application's name. `string` 
	appDescription: null,           // Your application's description. `string` 
	developerName: null,            // Your (or your developer's) name. `string` 
	developerURL: null,             // Your (or your developer's) URL. `string` 
	background: "#fff",             // Background colour for flattened icons. `string` 
	path: '/',                      // Path for overriding default icons path. `string` 
	display: "standalone",          // Android display: "browser" or "standalone". `string` 
	orientation: "portrait",        // Android orientation: "portrait" or "landscape". `string` 
	start_url: "/?homescreen=1",    // Android start application's URL. `string` 
	version: "1.0",                 // Your application's version number. `number` 

  icons: {
    android: false,              // Create Android homescreen icon. `boolean`
    appleIcon: true,            // Create Apple touch icons. `boolean`
    appleStartup: false,         // Create Apple startup images. `boolean`
    favicons: true,             // Create regular favicons. `boolean`
    windows: false,              // Create Windows 8 tile icons. `boolean`
    yandex: false                // Create Yandex browser icon. `boolean`
  }
};

export async function fav(sourceFile: string, outDir: string) {
  
  const htmlBasename = "index.html"

  const response = await favicons(sourceFile, config);

  await Promise.all(
    response.images.map(
      async (image) =>
        await writeFile(resolve(outDir, image.name), image.contents),
    ),
  );

  await Promise.all(
    response.files.map(
      async (file) =>
        await writeFile(resolve(outDir, file.name), file.contents),
    ),
  );

  await writeFile(resolve(outDir, htmlBasename), response.html.join("\n"));
}

async function main() {
  const sourceFile = resolve(__dirname, '../svg/brand-ftc-logo-square.svg');
  const outDir = await mkDirDist('favicons');

	await fav(sourceFile, outDir)
}

if (require.main == module) {
  main().catch(console.error);
}

