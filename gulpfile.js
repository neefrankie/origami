const path = require('path');
const loadJsonFile = require('load-json-file');
const stats = require('@ftchinese/component-stats');

const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const Footer = require('./lib');

const deployDir = path.resolve(__dirname, '../ft-interact');
const demoDir = `${deployDir}/demos/${path.basename(__dirname)}`;

// change NODE_ENV between tasks.
gulp.task('prod', function(done) {
  return Promise.resolve(process.env.NODE_ENV = 'production');
});

gulp.task('dev', function(done) {
  return Promise.resolve(process.env.NODE_ENV = 'development');
});

gulp.task('html', async function () {

  const json = await loadJsonFile('origami.json');
  await Promise.all(json.demos.map(async demo => {
    const footer = new Footer(demo.theme);
    await buildPage({
      out: path.resolve(__dirname, `dist/footer-${demo.theme}.html`),
      template: 'index.html',
      footer: footer.data.footer,
      inline: process.env.NODE_ENV === 'production'
    });
  }));

  browserSync.reload('*.html');
});

gulp.task('styles', function styles() {
  return gulp.src('demos/src/*.scss')
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }))
    .on('error', err => {
      console.log(err)
    })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream({once:true}));
});

gulp.task('serve', 
  gulp.parallel(
    'html', 'styles',
    function serve() {
    browserSync.init({
      server: {
        baseDir: ['dist'],
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

// Procude demo
gulp.task('stats', () => {
  return stats({
      outDir: demoDir
    })
    .catch(err => {
      console.log(err);
    });
});