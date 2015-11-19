'use strict'
const gulp = require('gulp');
const del = require('del');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const svgmin = require('gulp-svgmin');
const svgToCss = require('gulp-svg-to-css');
const svgstore = require('gulp-svgstore');

const svg2png = require('gulp-svg2png');
const rsvg = require('gulp-rsvg');

const sequence = require('gulp-sequence');

const browserSync = require('browser-sync').create();

//Generate inline svg css
gulp.task('svg2css', function() {
  return gulp.src('demo/svg/*.svg')
    .pipe(svgmin())
    .pipe(svgToCss({
      name: 'icons.data.svg.css',
      prefix: 'icon-',
      template: '.{{prefix}}{{filename}}{background-image:url("{{{dataurl}}}");}'
    }))
    .pipe(gulp.dest('demo/styles/'));
});

//Generate a svg sprite with `symbol` elements
gulp.task('svgstore', function() {
  var svgs = gulp.src('demo/svg/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(rename('sprite.symbol.svg'))
    .pipe(gulp.dest('demo/icons/'));
});

gulp.task('svgmin', function() {
  return gulp.src('demo/svg/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('demo/icons/svg'));
});

gulp.task('svg2png', function() {
  return gulp.src('demo/svg/*.svg')
    .pipe(svg2png([0.2]))
    .pipe(gulp.dest('demo/icons/png'));
});

gulp.task('rsvg', function() {
  return gulp.src('demo/svg/social*.svg')
    .pipe(rsvg({
      format: 'png',
      scale: 0.2
    }))
    .pipe(gulp.dest('demo/icons/png'));
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

gulp.task('build', ['svg2css', 'svgstore', 'svgmin', 'dist']);

gulp.task('serve', ['build'], function() {
  browserSync.init({
    files: ['demo/**/*', 'dist/*'],
    server: {
      baseDir: ['demo', 'src'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('src/*', ['dist']);
  gulp.watch(['demo/*.html', 'demo/styles', 'dist']).on('change', browserSync.reload);
});

