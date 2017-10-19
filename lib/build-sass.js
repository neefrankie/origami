const pify = require('pify');
const path = require('path');
const fs = require('fs-jetpack');
const sass = pify(require('node-sass').render);

async function buildSass(input, output) {
  const {css, stats} = await sass({
    file: input, 
    includePaths: [path.resolve(__dirname, '../bower_components')]
  });
  console.log(`Build FTC footer style in ${stats.duration}ms.`);
  const dest = path.resolve(__dirname, `../dist/${output}.css`);
  await fs.writeAsync(dest, css.toString());
}

if (require.main == module) {
  buildSass(path.resolve(__dirname, '../demos/src/demo.scss'), 'main')
    .catch(err => {
      console.log(err);
    });
}

module.exports = buildSass;