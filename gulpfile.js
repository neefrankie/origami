'use strict'
const gulp = require('gulp');
const del = require('del');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sequence = require('gulp-sequence');

const browserSync = require('browser-sync').create();

gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('sass', function() {
  return gulp.src('app/*.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', sass.logError))
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream());
});

//distribute
gulp.task('clean', function() {
  return del(['dist/*']);
});

gulp.task('serve', ['clean'], function() {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'app', 'dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'dist/*.js'
  ]).on('change', browserSync.reload);

  gulp.watch(['app/*.scss'], ['sass']);
});


