'use strict'
const gulp = require('gulp');
const del = require('del');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const browserify = require('browserify');
const babel = require('gulp-babel');
const babelify = require('babelify');
const sequence = require('gulp-sequence');
const through2 = require('through2');
const wiredep = require('wiredep').stream;

const browserSync = require('browser-sync').create();

var config = {
  dependencies: false,
  scss: {
    block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
    detect: {
      css: /@import\s['"](.+css)['"]/gi,
      sass: /@import\s['"](.+sass)['"]/gi,
      scss: /@import\s['"](.+scss)['"]/gi
    },
    replace: {
      css: '@import "{{filePath}}";',
      sass: '@import "{{filePath}}";',
      scss: '@import "{{filePath}}";'
    }
  }
};

gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('demo'));
});

gulp.task('styles', function() {
  return gulp.src('app/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return gulp.src('app/scripts/main.js')
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
    .pipe(rename('main.bundle.js'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(browserSync.stream());
});

//distribute
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

  gulp.watch('bower.json', ['wiredep']);
  gulp.watch('app/scripts/*.js', ['scripts']);
  gulp.watch(['app/styles/*.scss'], ['styles']);
});

gulp.task('dist', function() {
  return gulp.src('dist/share.js')
    .pipe(rename({extname: 'min.js'}))
    .pipe('dist');
});

gulp.task('build', function() {
  return gulp.src('app/scripts/share.es6.js')
    .pipe(babel())
    .pipe(rename('share.js'))
    .pipe(gulp.dest('lib'));
});
