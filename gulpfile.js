'use strict'
const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const sequence = require('gulp-sequence');
const plumber = require('gulp-plumber');
const browserify = require('browserify');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync').create();

gulp.task('styles', function() {
  return gulp.src('main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  var b = browserify({
    entries: 'app/index.js',
    debug: true
  });

  return b.bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end')
    })  
    .pipe(source('main.js'))
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
    'app/*.html'
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