const promisify = require('promisify-node')
const fs = promisify('fs');
const path = require('path');
const url = require('url');
const isThere = require('is-there');
const co = require('co');
const mkdirp = require('mkdirp');
const helper = require('./helper');

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
var cache;

const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);

process.env.NODE_ENV = 'dev';

// change NODE_ENV between tasks.
gulp.task('prod', function(done) {
  process.env.NODE_ENV = 'prod';
  done();
});

gulp.task('dev', function(done) {
  process.env.NODE_ENV = 'dev';
  done();
});

gulp.task('html', () => {
// determine whether include `/api/resize-iframe.js` listed in `ftc-components`.
  var embedded = false;

  return co(function *() {
    const destDir = '.tmp';

    if (!isThere(destDir)) {
      mkdirp(destDir, (err) => {
        if (err) console.log(err);
      });
    }
    if (process.env.NODE_ENV === 'prod') {
      embedded = true;
    }

    const origami = yield helper.readJson('origami.json');

    const demos = origami.demos;

    const renderResults = yield Promise.all(demos.map(function(demo) {

      const template = demo.template;
      console.log(`Using template "${template}" for "${demo.name}"`);

      const context = {
        pageTitle: demo.name,
        description: demo.description,
        embedded: embedded
      };

      return helper.render(template, context, demo.name);
    }));

    yield Promise.all(renderResults.map(result => {
      const dest = `.tmp/${result.name}.html`;
      return fs.writeFile(dest, result.content, 'utf8');
    }));
  })
  .then(function(){
    browserSync.reload('*.html');
  }, function(err) {
    console.error(err.stack);
  });
});

gulp.task('styles', function styles() {
  const DEST = '.tmp/styles';

  return gulp.src('demos/src/*.scss')
    .pipe($.changed(DEST))
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      cssnext({
        features: {
          colorRgba: false
        }
      })
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('eslint', () => {
  return gulp.src('client/js/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('webpack', (done) => {
  if (process.env.NODE_ENV === 'prod') {
    delete webpackConfig.watch;
  }

  webpack(webpackConfig, function(err, stats) {
    if (err) throw new $.util.PluginError('webpack', err);
    $.util.log('[webpack]', stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload('demo.js');
    done();
  });
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', gulp.parallel('html', 'styles', 'webpack', () => {
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

  gulp.watch(['demos/src/*.{html,json}', 'partials/*.html'], gulp.parallel('html'));

  gulp.watch('demos/src/*.scss',gulp.parallel('styles'));
}));

gulp.task('build', gulp.parallel('html', 'styles', 'webpack'));

gulp.task('copy', () => {
  const DEST = path.resolve(__dirname, demosDir, projectName);
  console.log(`Deploying to ${DEST}`);
  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('prod', 'clean', 'build', 'copy', 'dev'));


// dist js to be directly used in the browser.
gulp.task('rollup', () => {
  return rollup({
    entry: './src/js/toggle.js',
    plugins: [buble()],
    cache: cache,
    // external: ['dom-delegate']
  }).then(function(bundle) {
    cache = bundle;

    return bundle.write({
      format: 'iife',
      moduleName: 'Toggle',
      moduleId: 'ftc-toggle',
      // globals: {
      //   'dom-delegate': 'domDelegate.Delegate'
      // },
      dest: 'dist/ftc-toggle.js',
      sourceMap: true,
    });
  });
});
