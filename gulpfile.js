const fs = require('mz/fs');
const path = require('path');
const url = require('url');
const isThere = require('is-there');
const co = require('co');
const nunjucks = require('nunjucks');
const footer = require('./src/js/data.js');

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);

nunjucks.configure(process.cwd(), {
  noCache: true,
  watch: false
});

function render(view, context, destFile) {
  return new Promise(function(resolve, reject) {
    nunjucks.render(view, context, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve({
          name: destFile,
          content: result
        });
      }
    });
  });
}

process.env.NODE_ENV = 'dev';

// change NODE_ENV between tasks.
gulp.task('prod', function(done) {
  process.env.NODE_ENV = 'prod';
  done();
});

gulp.task('dev', function(done) {
  process.env.NODE_ENV = 'dev';
  done();
});

gulp.task('html', () => {
  var embedded = false;

  return co(function *() {
    const destDir = '.tmp';

    const embedded = process.env.NODE_ENV === 'prod';

    try {
      yield fs.access(destDir, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {    
      yield fs.mkdir(destDir);
    }

    const origami = yield fs.readFile('origami.json', 'utf8');

    const demos = JSON.parse(origami).demos;

    const renderResults = yield Promise.all(demos.map(demo => {
      // Use demo.theme to override default theme
      Object.assign(footer, demo);
      const context = {
        pageTitle: demo.name,
        footer,
        embedded
      }
      // const context = deepMerge({footer}, demo);
      // Object.assign(context, {embedded});

      return render(demo.template, context, demo.name);
    }));

    yield Promise.all(renderResults.map(result => {
      const dest = `.tmp/${result.name}.html`;
      return fs.writeFile(dest, result.content, 'utf8');
    }));  
  })
  .then(function(){
    browserSync.reload('*.html');
  }, function(err) {
    console.error(err.stack);
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