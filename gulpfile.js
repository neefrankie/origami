const fs = require('mz/fs');
const path = require('path');
const co = require('co');
const deepMerge = require('deepmerge');
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

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const mkdir = require('./lib/mkdir.js');

const settings = require('./src/js/settings.json');
const images = settings.map(setting => {
  return setting.name
});

const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);

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

// minify svg
gulp.task('svgmin', () => {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe(gulp.dest('svg'));
});

// generate nunjucks templates for image-services.
gulp.task('templates', () => {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe($.cheerio({
      run: function($, file) {
        $('.background').attr('fill', '{{background}}');
        $('.foreground').attr('fill', '{{foreground}}');
      }
    }))
    .pipe(gulp.dest('templates'));
});

gulp.task('svgstore', () => {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe($.cheerio({
      run: function($, file) {
        $('.background').remove();
        $('.foreground').removeAttr('fill').removeAttr('id')
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe($.svgstore())
    .pipe($.rename('social-images-sprite.svg'))
    .pipe(gulp.dest('dist'))
});

// /* demo tasks */
gulp.task('html', () => {
  return co(function *() {
    const destDir = '.tmp';
    const embedded = process.env.NODE_ENV === 'prod';

    yield mkdir(destDir);

    const origami = yield fs.readFile('origami.json', 'utf8');

    const demos = JSON.parse(origami).demos;

    const renderResults = yield Promise.all(demos.map(function(demo) {

      const context = deepMerge({
        images,
        embedded
      }, demo);

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

gulp.task('styles', () => {
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

gulp.task('clean', () => {
  return del(['.tmp/**']).then(()=>{
    console.log('.tmp directory deleted');
  });
});

gulp.task('serve', gulp.parallel('html', 'styles', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      directory: true,
      routes: {
        '/dist': 'dist'
      }
    }
  });

  gulp.watch(['demos/src/*.html', 'origami.json'], gulp.parallel('html'));

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
  return gulp.src(['.tmp/**/*', 'static*/**/*.{svg,png}',])
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('clean', 'prod', gulp.parallel('html', 'styles'), 'copy', 'dev'));
