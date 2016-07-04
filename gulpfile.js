const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const cssnext = require('postcss-cssnext');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
process.env.NODE_ENV = 'development';

const demoFolder = 'ft-interact';
const projectName = path.basename(__dirname);

function readFilePromisified(filename) {
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
      return readFilePromisified('./demos/src/data.json')
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

gulp.task('scripts', function() {
  const DEST = '.tmp/scripts/';

  if (process.env.NODE_ENV === 'production') {
    webpackConfig.watch = false;
  }

  return gulp.src('demos/src/demo.js')
    .pipe(webpack(webpackConfig))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream({once:true}));
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', gulp.parallel('mustache', 'styles', 'scripts', function serve () {
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

  gulp.watch(['demo/src/*.js', 'src/**/*.js'], gulp.parallel('scripts'));
}));

// Set NODE_ENV according to dirrent task run.
// Any easy way to set it?
gulp.task('dev', function() {
  return Promise.resolve(process.env.NODE_ENV = 'development')
    .then(function(value) {
      console.log('NODE_ENV: ' + process.env.NODE_ENV);
    });
});

gulp.task('prod', function() {
  return Promise.resolve(process.env.NODE_ENV = 'production')
    .then(function(value) {
      console.log('NODE_ENV: ' + process.env.NODE_ENV);
    });
});

gulp.task('demos:copy', function() {
  const DEST = path.join(__dirname, '..', demoFolder, projectName);

  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
})

gulp.task('demos', gulp.series('prod', 'clean', gulp.parallel('mustache', 'styles', 'scripts'), 'demos:copy', 'dev'));