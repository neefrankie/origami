'use strict'
var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var debowerify = require('debowerify');
var babelify = require('babelify');

var bourbon = require('bourbon').includePaths;
var browserSync = require('browser-sync').create();


gulp.task('styles', function() {
  return gulp.src('main.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components', bourbon]
    }).on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  var b = browserify({
    entries: 'client/main.js',
    debug: true,
    cache: {},
    packageCache: {},
    transform: [debowerify, babelify],
    plugin: [watchify]
  });

  b.on('update', bundle);
  b.on('log', $.util.log);

  bundle();

  function bundle(ids) {
    $.util.log('Compiling JS...');
    if (ids) {
      console.log('Chnaged Files:\n' + ids);
    }   
    return b.bundle()
      .on('error', function(err) {
        $.util.log(err.message);
        browserSync.notify('Browerify Error!')
        this.emit('end')
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe(browserSync.stream({once:true}));
  }
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', ['styles', 'scripts'], function() {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'demo'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'demo/*.html'
  ]).on('change', browserSync.reload);

  gulp.watch(['main.scss', 'src/**/*.scss'], ['styles']);
});