const pify = require('pify');
const path = require('path');
const fs = require('fs-jetpack');
const inlineSource = pify(require('inline-source'));
const nunjucks = require('nunjucks');
nunjucks.configure(path.resolve(__dirname, '../views'), {
  noCache: true,
  watch: false
});
const render = pify(nunjucks.render);


/**
 * @param {String} out - file path for the generated file
 * @param {String} template - the template file to use
 * @param {Object} context - the footer data
 * @param {Boolean} inline 
 * @return {Promise<void>}
 * @example
 * {
 *  name: 'ftc-footer-dark',
 *  template: 'index.html',
 *  footer: {
 *    theme: 'theme-dark',
 *    matrix: [],
 *    copyrightYear: 2017
 *  }
 * }
 */
async function buildPage({out, template, footer, inline=false}={}) {
  let html = await render(template, {footer});
  if (inline) {
    html = await inlineSource(html, {
      compress: false,
      rootpath: path.dirname(out)
    });
  }

  console.log(`Build HTML: ${out}`);
  return await fs.writeAsync(out, html);
}

module.exports = buildPage;