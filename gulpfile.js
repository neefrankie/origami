'use strict'
const gulp = require('gulp');
const del = require('del');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sequence = require('gulp-sequence');

const browserSync = require('browser-sync').create();

gulp.task('wiredep', () => {
  gulp.src('demo/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('demo/styles'));

  gulp.src('demo/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('demo'));
});

gulp.task('sass', function() {
  return gulp.src('demo/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.stream());
});

//distribute
gulp.task('clean', function() {
  return del(['dist/*']);
});

gulp.task('dist', ['clean'], function() {
  return gulp.src('src/share.js')
    .pipe(gulp.dest('dist/'))
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'demo', 'src'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'demo/*.html',
    'src/*.js',
    '.tmp/styles/*.css'
  ]).on('change', browserSync.reload);

  gulp.watch('src/*', ['dist']);
  gulp.watch(['demo/styles/*.scss'], ['sass']);
});


