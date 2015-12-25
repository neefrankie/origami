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
const browserSync = require('browser-sync').create();

gulp.task('styles', function() {
  return gulp.src('main.scss')
    ..pipe(sourcemaps.init())
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
  return browserify('main.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('.tmp'));
});
gulp.task('scripts:watch', ['scripts'], browserSync.reload);

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
  gulp.watch(['main.js', 'src/**/*.js'], ['scripts:watch']);
});

/*gulp.task('build:es6', sequence('clean', ['styles', 'scripts']));

gulp.task('serve:es6', ['build:es6'], function() {
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

  gulp.watch(['app/*.scss'], ['styles']);
  gulp.watch('es6/*.js', ['babelify']);
});*/

/*==== Test Feature=========*/

const babel = require('gulp-babel');
const babelify = require('babelify');
const through2 = require('through2');
const umd = require('gulp-umd');
const requirejs = require('requirejs');

gulp.task('umd', function() {
  gulp.src('src/js/*.js')
    .pipe(umd(/*{
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
    }*/))
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
});