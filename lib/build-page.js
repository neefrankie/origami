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
 * @param {String} name - name for the generated html file
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
async function buildPage({name, template, footer, inline=false}={}) {
  const dest = path.resolve(__dirname, `../dist/${name}.html`);

  let html = await render(template, {footer});
  if (inline) {
    html = await inlineSource(html, {
      compress: false,
      rootpath: path.resolve(__dirname, '../dist')
    });
  }

  await fs.writeAsync(dest, html);
  console.log(`Build HTML: ${dest}`);
}

module.exports = buildPage;