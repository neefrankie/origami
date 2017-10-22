const {resolve} = require('path');
const loadJsonFile = require('load-json-file');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const stats = require('@ftchinese/component-stats');

const buildPage = require('./lib/build-page');

let cache;

// The data is used to render nunjucks templates.
const shareContext = {
  title: encodeURIComponent("FTC share components"),
  url: encodeURIComponent("http://interactive.ftchinese.com/components/ftc-share.html"),
  summary: encodeURIComponent("This is the demo page for ftc share component")
};

gulp.task('html', async () => {
  const json = await loadJsonFile('origami.json');
  await Promise.all(json.demos.map(demo => {
    shareContext.inverse = demo.name === 'inverse';
    return buildPage({
      outfile: `.tmp/share-${demo.name}.html`,
      context: {share: shareContext},
      inline: process.env.NODE_ENV === 'production'
    });
  }));

  browserSync.reload('*.html');
  return Promise.resolve();
});

gulp.task('styles', function styles() {
  return gulp.src('demos/src/demo.scss')
    .pipe(sourcemaps.init({loadMaps:true}))
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }))
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('scripts', async () => {
  const inputOptions = {
    input: 'src/js/dist.js',
    plugins: [
      buble()
    ],
    cache: cache
  };
  const outputOptions = {
    file: '.tmp/scripts/demo.js',
    format: 'iife',
    sourcemap: true
  };
  const bundle = await rollup(inputOptions);
  console.log('Bundle modules:\n' +bundle.modules.map(m => m.id).join('\n'));

  await bundle.write(outputOptions);

  browserSync.reload();
  return;
});

gulp.task('serve', gulp.parallel('html', 'styles', 'scripts', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      directory: true
    }
  });

  gulp.watch(['views/**/*.html'], gulp.parallel('html'));

  gulp.watch(['demos/src/*.scss', 'src/scss/*.scss', '*.scss'], gulp.parallel('styles'));

  gulp.watch(['src/js/*.js'],gulp.parallel('scripts'));
}));

// gulp.task('stats', () => {
//   return stats({
//       outDir: demosDir
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });