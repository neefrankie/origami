import { readFile, writeFile, readdir } from 'fs/promises';
import { resolve } from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';
import { extractName, mkDirDist } from './dir';
import { fav } from './fav';

async function svgOptimize(svgContent: string, outFile: string): Promise<string> {
  const result = optimize(svgContent);

  await writeFile(outFile, result.data);

  console.log('Optimized svg to: ', outFile);

  return result.data;
}

async function svg2png(svgContent: string, outFilename: string) {
	const b = await sharp(Buffer.from(svgContent))
		.png()
		.toBuffer()

  await writeFile(outFilename, b);
	
  console.log('SVG converted to png: ', outFilename);
}

async function processSvg(filename: string, outDir: string) {
  const content = await readFile(filename, { encoding: 'utf-8'});

  const name = extractName(filename);

  const svgName = resolve(outDir, `${name}.svg`);
  const pngName = resolve(outDir, `${name}.png`);

  // Generate optmized svg
  const opSvgStr = await svgOptimize(content, svgName);

  // Generate png from optimized svg.
  await svg2png(opSvgStr, pngName);
}

/**
 * @description svg2PngAll converts all svg fiels in sourceDir
 * to png and save the result to targetDir.
 * @param sourceDir - the directory containing svg files.
 * @param targetDir - the directory to put generated files.
 */
async function processAll(sourceDir: string, targetDir: string) {
  const files = await readdir(sourceDir);

  // Build absolute path to source files and filter out thoese not ending with .svg
  const svgFiles = files.map(f => {
      if (!f.endsWith('.svg')) {
        return '';
      }
      // Return absolute path
      return resolve(sourceDir, f);
    })
    .filter(f => f !== '');

  await Promise.all(svgFiles.map(svgFile => {
    return processSvg(svgFile, targetDir);
  }));
}

async function main() {
  const inputDir = resolve(__dirname, '../svg');
  const outDir = await mkDirDist('ftc');

  await processAll(inputDir, outDir);

  const input = resolve(__dirname, '../svg/brand-ftc-logo-square.svg');
  const favDir = await mkDirDist('ftc/fav');
  await fav(input, favDir);
}

if (require.main === module) {
	main().catch(console.error);
}

