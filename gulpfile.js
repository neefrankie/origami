const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const debowerify = require('debowerify');
const babelify = require('babelify');
const cssnext = require('postcss-cssnext');
const browserSync = require('browser-sync').create();

const demoPath = '../../ftrepo/ft-interact/';
const projectName = path.basename(__dirname);

gulp.task(function mustache() {
  const DEST = '.tmp';
  const options = JSON.parse(fs.readFileSync('demo/data.json'));

  return gulp.src('demo/index.mustache')
    .pipe($.changed(DEST))
    .pipe($.mustache(options, {
      extension: '.html'
    }))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('styles', function styles() {
  const DEST = '.tmp/styles';

  return gulp.src('demo/demo.scss')
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

/* Bundle js with watchify + browserify + debowerify + babelify*/
gulp.task('scripts', function scripts() {
  const b = browserify({
    entries: 'demo/demo.js',
    debug: true,
    cache: {},
    packageCache: {},
    transform: [babelify, debowerify],
    plugin: [watchify]
  });

  b.on('update', bundle);
  b.on('log', $.util.log);

  bundle();

  function bundle(ids) {
    $.util.log('Compiling JS...');
    if (ids) {
      console.log('Changed Files:\n' + ids);
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

gulp.task(function js() {
  const DEST = '.tmp/scripts';

  const b = browserify({
    entries: 'demo/main.js',
    debug: true,
    cache: {},
    packageCache: {},
    transform: [babelify, debowerify]
  });

  return b.bundle()
    .on('error', function(err) {
      $.util.log(err.message);
      this.emit('end')
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DEST));
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', gulp.parallel('mustache', 'styles', 'scripts', function erve () {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['demo/*.{mustache,json}', '*.mustache'], gulp.parallel('mustache'));

  gulp.watch(['demo/*.scss', 'src/**/*.scss', '*.scss'], gulp.parallel('styles'));
  gulp.watch(['demo/*.js', 'src/**/*.js'], gulp.parallel('scripts'));

}));

gulp.task('deploy', gulp.series('clean', 'mustache', 'styles', 'js', function() {
  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(config.deploy.assets + projectName));
}));