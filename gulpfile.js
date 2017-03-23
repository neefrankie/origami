const pify = require('pify');
const fs = require('fs-jetpack');
const path = require('path');
const loadJsonFile = require('load-json-file');
const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const getFooterData = require('./lib/index.js');
const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);

const nunjucks = require('nunjucks');
nunjucks.configure(process.cwd(), {
  noCache: true,
  watch: false
});

const render = pify(nunjucks.render);

process.env.NODE_ENV = 'development';

// change NODE_ENV between tasks.
gulp.task('prod', function(done) {
  process.env.NODE_ENV = 'production';
  done();
});

gulp.task('dev', function(done) {
  process.env.NODE_ENV = 'development';
  done();
});

function buildPages(demos) {
  const env = {
    isProduction: process.env.NODE_ENV === 'production'
  };

  return Promise.all(demos.map(demo => {
    const footer = getFooterData({
      theme: demo.theme,
      type: demo.type
    });
    const context = Object.assign(demo, {
      footer,
      env
    })
    return render(demo.template, context)
      .then(html => {
        return fs.writeAsync(`.tmp/${demo.name}.html`, html);
      })
      .catch(err => {
        throw err;
      });
  }));
}

gulp.task('html', () => {
  return loadJsonFile('origami.json')
    .then(json => {
      return buildPages(json.demos)
    })
    .then(() => {
      browserSync.reload('*.html');
      return Promise.resolve();
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('styles', function styles() {
  const DEST = '.tmp/styles';

  return gulp.src('demos/src/*.scss')
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
    .pipe(browserSync.stream({once:true}));
});

gulp.task('eslint', () => {
  return gulp.src('client/js/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', 
  gulp.parallel(
    'html', 'styles',
    function serve() {
    browserSync.init({
      server: {
        baseDir: ['.tmp'],
        index: 'footer.html',
        directory: true,
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch(['demos/src/*.html', 'partials/*.html'], gulp.parallel('html'));

    gulp.watch(['demos/src/*.scss', '*.scss', 'src/**/*.scss'], gulp.parallel('styles'));
  })
);

gulp.task('build', gulp.parallel('html', 'styles'));


gulp.task('copy', () => {
  const DEST = path.resolve(__dirname, demosDir, projectName);
  console.log(`Deploying to ${DEST}`);
  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('prod', 'clean', 'build', 'copy', 'dev'));