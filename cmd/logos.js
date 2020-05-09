const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * @description Convert a svg to png.
 * @param {string} inFile - input file name
 * @param {string} outFile - output file name
 */
function svg2png(inFile, outDir) {
  const baseName = path.basename(inFile, '.svg');
  const outFile = path.resolve(outDir, `${baseName}.png`);

  return sharp(inFile)
    .png()
    .toFile(outFile);
}

/**
 * 
 * @param {string} inDir 
 * @param {string} outDir 
 */
async function convert(inDir, outDir) {
  const inFiles = await fs.readdir(inDir);

  await fs.mkdir(outDir, { recursive: true });
  
  const tasks = inFiles
    .filter(fileName => {
      return path.extname(fileName) === '.svg';
    })
    .map(fileName => {
      const file = path.resolve(inDir, fileName);

      console.log(`Converting ${file}`);

      return svg2png(file, outDir)
    });

  await Promise.all(tasks);
}

if (require.main === module) {
  const inDir = path.resolve(__dirname, '../assets/logos')
  const outDir = path.resolve(process.cwd, 'public/logos')

  convert(inDir, outDir)
    .catch(err => {
      console.log(err)
    });
}
