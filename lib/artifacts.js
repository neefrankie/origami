const debug = require('debug')
const log = debug('o-share:artifacts');
const info = debug('info');
const {resolve} = require('path');
const fs = require('fs-jetpack');
const pify = require('pify');
const nunjucks = require('nunjucks');
nunjucks.configure(resolve(__dirname, '../views'), {
  autoescape: false,
  noCache: true,
  watch: false
});
const render = pify(nunjucks.render);
const sass = pify(require('node-sass').render);
const rollup = require('rollup');
const buble = require('rollup-plugin-buble');

let cache;
const socials = require('./socials.json');

// Extra HTML containing Nunjucks template.
// Since we are compiling a Nunjucks file to another Nunjucks file 
// which has its own Nunjucks tags,
// we could not have them included in the initial Nunjucks file
// otherwise the derived template file will have no Nunjucks tags present.
// `base.html`<Nunjucks> -> `o-share.html`<Nunjucks>
const prefix = `<div class="container{% if share.inverse %} container--inverse{% endif %}">
  <div data-o-component="o-share" class="o-share{% if share.inverse %} o-share--inverse{% endif %}">
`;
const suffix = `
  </div>
</div>`;

/**
 * @desc Generate template to be consumed by nunjucks, and js and css.
 */
class Artifacts {
  /**
   * @param {String[]} names - The social plaform names
   */
  constructor(names=[]) {
    this.names = names;
    this.outDir = resolve(__dirname, '../dist');
  }

/**
 * @desc Use `lib/socials.json` and `views/base.html` to generate template file containg the list of social platforms you want to present.
 * Here we used a Nunjucks template file to generate another Nunjucks template file.
 * @return {Promise<String>}
 */
  async renderHtml() {
    let context;
    if (this.names.length > 0) {
      context = socials.filter(social => this.names.includes(social.name));
    } else {
      context = socials;
    }
    let html = await render('base.html', {items: context});
    html = prefix + html + suffix;
    return html;
  }
/**
 * @desc Compile the sass to style share icons
 * @param {Boolean} write - Also write the css string to file
 * @return {Promise<String>}
 */
  async buildSass(write=false) {
    const {css, stats} = await sass({
      file: resolve(__dirname, '../src/scss/dist.scss'), 
      includePaths: [resolve(__dirname, '../bower_components')]
    });
    log(`Sass entry: ${stats.entry}`);
    info(`Inlcuded files:\n${stats.includedFiles.join('\n')}`);
    info(`Build share style in ${stats.duration}ms.`);
    if (write) {
      try {
        await fs.writeAsync(`${this.outDir}/o-share.css`, css.toString());
        log(`Wrote CSS to ${this.outDir}/o-share.css`);
      } catch(e) {
        console.log(e);
      }
    }
    return css.toString();
  }
/**
 * @desc Build JS from `src/js/dist.js`. The generated JS is executed in this file.
 * @param {Boolean} write - Also write the JS string to file
 * @return {Promise<String>}
 */
  async buildJs(write=false) {
    const inputOptions = {
      input: resolve(__dirname, '../src/js/dist.js'),
      plugins: [
        buble()
      ],
      cache: cache
    };
    const outputOptions = {
      file: `${this.outDir}/o-share.js`,
      format: 'iife',
      sourcemap: false
    };
    const bundle = await rollup.rollup(inputOptions);
    info('JS modules:\n' +bundle.modules.map(m => m.id).join('\n'));
    const { code } = await bundle.generate(outputOptions);
    if (write) {
      try {
        await fs.writeAsync(`${this.outDir}/o-share.js`, code);
        log(`Wrote JS to ${this.outDir}/o-share.js`)
      } catch(e) {
        console.log(e);
      }
    }
    return code;
  }
/**
 * @desc Use `views/base.html` to generate `views/partials/o-share.html`
 * @private
 * @param {String} filename - File path to save
 */
  async buildPartial(filename) {
    if (!filename) {
      filename=resolve(__dirname, '../views/partials/o-share.html')
    }
    const html = await this.renderHtml();
    log(`Build share partial: ${filename}`);
    return await fs.writeAsync(filename, html);
  }
/**
 * @desc Build the HTML files containg the icons you choose, and inline JS and CSS. All resouces are packed into a single HTML template.
 * @param {String} filename - File path to save
 * @return {Promise<void>}
 */
  async buildBundle(filename) {
    if (!filename) {
      filename=resolve(__dirname, '../dist/o-share.html')
    }
    const [css, js, html] = await Promise.all([
      this.buildSass(),
      this.buildJs(),
      this.renderHtml()
    ]);
    log(`Inline JS and CSS`);
    const result = `<style type="text/css">${css}</style>` + html + `<script>${js}</script>`;
    log(`Write bundled HTML to ${filename}`);
    return await fs.writeAsync(filename, result);
  }
/**
 * @desc Static convenience method to build the distributed HTML template.
 * @return {Promise<Artifacts>}
 */
  static async init() {
    const artifacts = new Artifacts();
    try {
      await artifacts.buildBundle()
    } catch(e) {
      console.log(e);
    }
    return artifacts;
  }
}

module.exports = Artifacts;