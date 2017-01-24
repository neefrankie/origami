const fs = require('mz/fs');
const path = require('path');
const co = require('co');
const nunjucks = require('nunjucks');
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(
    [process.cwd()],
    {noCache: true, }
  ),
  {autoescape: false}
);

function render(template, context, destName) {
  return new Promise(function(resolve, reject) {
    env.render(template, context, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve({
          name: destName,
          content: result
        });
      }
    });
  });
}
const _ = require('lodash');
const mkdirp = require('./lib/mkdir.js');

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const settings = require('./src/js/settings.json');
const logos = settings.map(setting => {
  return setting.themes.map(theme => {
    return theme.type === 'default' ? setting.name : `${setting.name}-${theme.type}`;
  });
});

const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);

// change NODE_ENV between tasks.
gulp.task('prod', function(done) {
  process.env.NODE_ENV = 'prod';
  done();
});

gulp.task('dev', function(done) {
  process.env.NODE_ENV = 'dev';
  done();
});

// /* demo tasks */
gulp.task('html', () => {
// determine whether include `/api/resize-iframe.js` listed in `ftc-components`.
  var embedded = process.env.NODE_ENV === 'prod';

  return co(function *() {
    const destDir = '.tmp';

    yield mkdirp(destDir);

    const origami = yield fs.readFile('origami.json', 'utf8');

    const demos = JSON.parse(origami).demos;

    const renderResults = yield Promise.all(demos.map(function(demo) {

      const context = Object.assign({}, demo, {
        logos: _.flatten(logos),
        embedded
      });
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

  return gulp.src('demos/src/demo.scss')
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

gulp.task('clean', function() {
  return del(['.tmp/**']).then(()=>{
    console.log('Old files deleted');
  });
});

gulp.task('serve', gulp.parallel('html', 'styles', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'dist'],
      directory: true,
      routes: {
        '/dist': 'dist'
      }
    }
  });

  gulp.watch(['demos/src/*.{html,json}', 'origami.json'], gulp.parallel('html'));

  gulp.watch([
    'demos/src/*.scss',
    'src/scss/*.scss',
    '*.scss'],
    gulp.parallel('styles')
  );

}));

gulp.task('copy', () => {
  const DEST = path.resolve(__dirname, demosDir, projectName);
  console.log(`Deploying to ${DEST}`);
  return gulp.src(['.tmp/**/*', 'dist*/**/*.{svg,png,ico}',])
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('clean', 'prod', gulp.parallel('html', 'styles'), 'copy', 'dev'));

gulp.task('deploy', () => {
  return gulp.src('dist/*')
    .pipe(gulp.dest(path.revole(__dirname, '../ft-interact/bower_components/ftc-logos/')))
});
