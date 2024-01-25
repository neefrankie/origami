import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { fav } from './lib/fav';
import { ImageProcessor } from './lib/processor';
import { mkDirDist } from './lib/dir';


async function processSvg(filename: string, outDir: string) {
  const processor = new ImageProcessor(filename, outDir);

  await processor.optmizeSvg();
  await processor.toPng();
}

async function gatherFiles(sourceDir: string): Promise<string[]> {
  const files = await readdir(sourceDir);

  // Build absolute path to source files and filter out thoese not ending with .svg
  const svgFiles = files
    .filter(f => f.startsWith('ftc') && f.endsWith('.svg'))
    .map(f => resolve(sourceDir, f));

  return svgFiles;
}


async function main() {
  const inputDir = resolve(__dirname, '../svg');
  const outDir = await mkDirDist('ftc');

  const files = await gatherFiles(inputDir);

  await Promise.all(files.map(f => processSvg(f, outDir)))

  const input = resolve(__dirname, '../svg/brand-ftc-logo-square.svg');
  const favDir = await mkDirDist('ftc/fav');
  await fav(input, favDir);
}

if (require.main === module) {
	main().catch(console.error);
}

