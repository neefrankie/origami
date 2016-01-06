'use strict'
var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var sequence = require('gulp-sequence');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var bourbon = require('bourbon').includePaths;
var browserSync = require('browser-sync').create();

var webpackConfig = require('./webpack.config.js');

gulp.task('styles', function() {
  return gulp.src('main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components', bourbon]
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  var b = browserify({
    entries: './app/index.js',
    debug: true
  });

  return b
    .transform('debowerify')
    .bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end')
    })  
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream());
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', ['styles', 'scripts'], function() {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    '.tmp/*.js'
  ]).on('change', browserSync.reload);

  gulp.watch(['main.scss', 'src/**/*.scss'], ['styles']);
  gulp.watch(['app/*.js', 'main.js', 'src/**/*.js'], ['scripts']);
});

/*==== Test Feature=========*/

/*const babel = require('gulp-babel');
const babelify = require('babelify');
const through2 = require('through2');
const umd = require('gulp-umd');
const requirejs = require('requirejs');

gulp.task('umd', function() {
  gulp.src('src/js/*.js')
    .pipe(umd({
      dependencies: function(file) {
        return [
          {
            name: 'test',
            amd: 'test',
            cjs: './test',
            global: 'test',
            param: 'test'
          }
        ];
      }
    }))
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('es6', function () {
  return gulp.src('es6/index.js')
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, { debug: process.env.NODE_ENV === 'development' })
        .transform(require('babelify'))
        .bundle(function (err, res) {
          if (err) { return next(err); }

          file.contents = res;
          next(null, file);
        });
    }))
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(rename('share.js'))
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream());
});*/