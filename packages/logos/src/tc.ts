import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { extractName, mkDirDist } from './dir';
import { fav } from './fav';

async function square(input: string, size: number, outDir: string) {
  const file = await readFile(input)

  const b = await sharp(file)
    .png()
    .resize({
      width: size,
      height: size,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0}
    })
    .toBuffer();

  const name = extractName(input);

  await writeFile(resolve(outDir, `${name}-${size}.png`), b);
}

const sizes = [100, 200, 300];

async function main() {
  const input = resolve(__dirname, '../svg/tc-logo.png')
  const logoDir = await mkDirDist('tc');
  await Promise.all(sizes.map(size => square(input, size, logoDir)));

  const favDir = await mkDirDist('tc/fav');
  await fav(input, favDir);
}


main().catch(console.error);
