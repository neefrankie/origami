const {resolve, dirname} = require('path');
const pify = require('pify');
const fs = require('fs-jetpack');
const inlineSource = pify(require('inline-source'));
const nunjucks = require('nunjucks');
const env = nunjucks.configure(resolve(__dirname, '../views'), {
  autoescape: false,
  noCache: true,
  watch: false
});
const render = pify(nunjucks.render);

/**
 * @param {String} outfile - output html name
 * @param {Object} context - Data used to render template
 * @param {String} template - File name
 * @param {Boolean} inline
 * @return {Promise<void>}
 */
async function buildPage({outfile, context={}, template='index.html', inline=false}={}) {
  console.log(env.loaders.map(loader => loader.pathsToNames));
  console.log(env.loaders.map(loader => loader.searchPaths.join('\n')));

  let html = await render(template, context);
  
  if (inline) {
    html = await inline(html, {
      compress: false,
      rootpath: dirname(dest)
    });
  }
  console.log(`Build HTML: ${outfile}`);
  return await fs.writeAsync(outfile, html);
}

if (require.main == module) {
  buildPage({
    outfile: resolve(__dirname, '../.tmp/test.html')
  })
  .catch(err => {
    console.log(err);
  });
}
module.exports = buildPage;