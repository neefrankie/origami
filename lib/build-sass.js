const pify = require('pify');
const path = require('path');
const fs = require('fs-jetpack');
const sass = pify(require('node-sass').render);

async function buildSass(input, output) {
  const {css, stats} = await sass({
    file: input, 
    includePaths: [path.resolve(__dirname, '../bower_components')]
  });
  console.log(`Entry: ${stats.entry}`);
  console.log(`Inlcuded filed:\n${stats.includedFiles.join('\n')}`);
  console.log(`Build footer style in ${stats.duration}ms.`);
  const dest = path.resolve(__dirname, `../dist/${output}.css`);
  await fs.writeAsync(dest, css.toString());
}

if (require.main == module) {
  buildSass(path.resolve(__dirname, '../src/scss/dist.scss'), 'main')
    .catch(err => {
      console.log(err);
    });
}

module.exports = buildSass;