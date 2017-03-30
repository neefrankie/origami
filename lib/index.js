const fs = require('fs-jetpack');
const path = require('path');
const transformSvg = require('./transform-svg.js');
const svg2png = require('./svg2png.js');
const svgDir = path.resolve(__dirname, '../svg');

/*
 * @param {String} source - svg filename. Just basename, no path.
 * @param {String} dest - Output files directory. Aboslute path.
 * @param {String | null | undefined} color - color on path.
 * @param {String | null | undefined}
 * @param {Boolean} png - Whether generate png or not.
 */
async function generateImage({source, dest, png, color, background}={}) {
  const baseName = path.basename(source, '.svg');
  const svgOutput = `${dest}/${baseName}.svg`;
  const pngOutput = `${dest}/${baseName}.png`;

  try {
    const svgStr = await fs.readAsync(source);

    console.log(`Transforming SVG with color: ${color}`);
    const result = transformSvg(svgStr, color, background);

    console.log(`Generating SVG: ${svgOutput}`);
    await fs.writeAsync(svgOutput, result);

    if (png) {
      console.log(`Generating PNG: ${pngOutput}`);
      await svg2png(result, pngOutput);
    }
  } catch (e) {
    console.log('Error in generateImage');
    throw e;
  }
}
 /*
  * @param {String} to - Output directory
  * @param {Boolean} png - If `true`, generate png together with svg. Default `false`
  * @param {String | null} color - Color on image's path. `null` removes color.
  * @param {String | null | undefined} background - Bacground color. If `null`, remove background. If `undefined`, use default background.
  */
async function socialImages({to='public/social-images', png=true, color, background}={}) {
  const dest = path.resolve(process.cwd(), to);

  try {
    const filenames = await fs.listAsync(svgDir);
    const svgs = filenames.filter(filename => {
      return path.extname(filename) === '.svg';
    });

    await Promise.all(svgs.map(svg => {
      return generateImage({
        source: `${svgDir}/${svg}`,
        dest: dest,
        png: png,
        color: color,
        background: background
      });
    }));
  } catch (e) {
    console.log('Error in customImage');
    throw e;
  }
}

if (require.main === module) {
  socialImages({
      color: '#a7a59b',
      background: null
    })
    .catch(err => {
      console.log('Error');
      console.log(err);
    })
}

module.exports = socialImages;