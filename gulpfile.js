const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const cssnext = require('postcss-cssnext');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');

var cache;

const demoFolder = '../ft-interact';
const projectName = path.basename(__dirname);

function readFile(filename) {
  return new Promise(
    function(resolve, reject) {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
          console.log('Cannot find file: ' + filename);
          reject(err);
        } else {
          resolve(data);
        }
      });
    }
  );
}

gulp.task('mustache', function () {
  const DEST = '.tmp';

  return gulp.src('./demos/src/index.mustache')
    .pipe($.data(function(file) {
      return readFile('./demos/src/data.json')
        .then(function(value) {
          return JSON.parse(value);
        });
    }))   
    .pipe($.mustache({}, {
      extension: '.html'
    }))
    .pipe(gulp.dest(DEST));
});

gulp.task('styles', function styles() {
  const DEST = '.tmp/styles';

  return gulp.src('demos/src/demo.scss')
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

gulp.task('webpack', (done) => {
  webpack(webpackConfig, function(err, stats) {
    if (err) throw new $.util.PluginError('webpack', err);
    $.util.log('[webpack]', stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }))
    browserSync.reload('ftc-share.js');
    done();
  });
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', gulp.parallel('mustache', 'styles', 'webpack', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['demo/src/*.{mustache,json}', '*.mustache'], gulp.parallel('mustache'));

  gulp.watch(['demo/src/*.scss', 'src/**/*.scss', '*.scss'], gulp.parallel('styles'));

  gulp.watch(['demos/src/*.js', 'src/js/share.js', 'main.js'], gulp.parallel('scripts'));

}));

gulp.task('demos:copy', function() {
  const DEST = path.resolve(__dirname, demoFolder, projectName);

  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
});

gulp.task('demos', gulp.series('clean', gulp.parallel('mustache', 'styles', 'webpack'), 'demos:copy'));


// dist js to be directly used in the browser.
gulp.task('rollup', () => {
  return rollup({
    entry: './src/js/share.js',
    plugins: [buble()],
    cache: cache,
    // external: ['dom-delegate']
  }).then(function(bundle) {
    cache = bundle;

    return bundle.write({
      format: 'iife',
      moduleName: 'Share',
      moduleId: 'ftc-share',
      // globals: {
      //   'dom-delegate': 'domDelegate.Delegate'
      // },
      dest: 'dist/ftc-share.js',
      sourceMap: true,
    });
  });
});

gulp.task('dist', gulp.parallel('rollup'));