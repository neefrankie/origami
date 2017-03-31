const fs = require('fs-jetpack');
const path = require('path');
const SVGO = require('svgo');
const svg2png = require('./svg2png.js');
const svgDir = path.resolve(__dirname, '../svg');

const svgo = new SVGO();

async function generateImage({source, dest}={}) {
  const baseName = path.basename(source, '.svg');
  const svgOutput = `${dest}/${baseName}.svg`;
  const pngOutput = `${dest}/${baseName}.png`;

  try {
    const svgStr = await fs.readAsync(source);

    const {data, info} = await svgo.optimize(svgStr);

    console.log(`Generating SVG: ${svgOutput}`);
    await fs.writeAsync(svgOutput, data);

    console.log(`Generating PNG: ${pngOutput}`);
    await svg2png(data, pngOutput);

  } catch (e) {
    console.log('Error in generateImage');
    throw e;
  }
}

async function logoImages(to='public/ftc-logos') {
  const dest = path.resolve(process.cwd(), to);

  try {
    const filenames = await fs.listAsync(svgDir);
    const svgs = filenames.filter(filename => {
      return path.extname(filename) === '.svg';
    });

    await Promise.all(svgs.map(svg => {
      return generateImage({
        source: `${svgDir}/${svg}`,
        dest: dest
      });
    }));
  } catch (e) {
    console.log('Error in logoImages');
    throw e;
  }
}

if (require.main === module) {
  logoImages()
    .catch(err => {
      console.log('Error');
      console.log(err);
    });
}

module.exports = logoImages;
module.exports.buildUrl = require('./build-url.js');