const pify = require('pify');
const path = require('path');
const fs = require('fs-jetpack');
const loadJsonFile = require('load-json-file');
const inline = pify(require('inline-source'));
const nunjucks = require('nunjucks');
nunjucks.configure(process.cwd(), {
  autoescape: false,
  noCache: true
});
const render = pify(nunjucks.render);
const stats = require('@ftchinese/component-stats');

const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');

const demosDir = path.resolve(process.cwd(), `../ft-interact/demos/${path.basename(__dirname)}`);

let cache;

gulp.task('prod', function() {
  return Promise.resolve(process.env.NODE_ENV = 'production');
});

gulp.task('dev', function() {
  return Promise.resolve(process.env.NODE_ENV = 'development');
});

// The data is used to render nunjucks templates.
const share = {
  title: encodeURIComponent("FTC share components"),
  url: encodeURIComponent("http://interactive.ftchinese.com/components/ftc-share.html"),
  summary: encodeURIComponent("This is the demo page for ftc share component")
};

async function buildPage(data) {
  const flags = {
    isProduction: process.env.NODE_ENV === 'production'
  };
  const context = Object.assign(data, {flags});
  const dest = path.resolve(__dirname, `dist/${data.name}.html`);

  let html = render(data.template, context);
  if (flags.isProduction) {
    html = await inline(html, {
      compress: true,
      rootpath: path.resolve(__dirname, 'dist')
    });
  }

  return await fs.writeAsync(dest, html);
}

gulp.task('html', async () => {
  const json = loadJsonFile('origami.json');
  await Promise.all(json.demos.map(demo => {
    return buildPage(Object.assign(demo, {share}));
  }));
  browserSync.reload('*.html');
  return Promise.resolve();
});

gulp.task('styles', function styles() {
  const DEST = '.tmp/styles';

  return gulp.src('demos/src/demo.scss')
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }))
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('scripts', () => {
  const dest = '.tmp/scripts/demo.js';
  return rollup({
    entry: 'demos/src/demo.js',
    plugins: [
      buble()
    ],
    cache: cache
  }).then(function(bundle) {
    cache = bundle;
    return bundle.write({
      dest: '.tmp/scripts/demo.js',
      format: 'iife',
      sourceMap: true
    });
  })
  .then(() => {
    browserSync.reload();
    return Promise.resolve();
  })
  .catch(err => {
    console.log(err);
  });
});

gulp.task('serve', gulp.parallel('html', 'styles', 'scripts', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      index: 'share.html',
      directory: true,
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['demos/src/*.{html,json}', 
'partials/*.html'], gulp.parallel('html'));

  gulp.watch(['demos/src/*.scss', 'src/scss/*.scss', '*.scss'], gulp.parallel('styles'));

  gulp.watch(['demos/src/*.js', 'src/js/*.js'],gulp.parallel('scripts'));
}));

gulp.task('stats', () => {
  return stats({
      outDir: demosDir
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('copy:demo', () => {
  console.log(`Copying demo to ${demosDir}`);
  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(demosDir));
});