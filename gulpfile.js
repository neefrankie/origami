const pify = require('pify');
const path = require('path');
const fs = require('fs-jetpack');
const loadJsonFile = require('load-json-file');
const inline = pify(require('inline-source'));
const nunjucks = require('nunjucks');
nunjucks.configure(process.cwd(), {
  autoescape: false,
  noCache: true
});
const render = pify(nunjucks.render);
const stats = require('@ftchinese/component-stats');

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');

const demosDir = path.resolve(process.cwd(), `../ft-interact/demos/${path.basename(__dirname)}`);

let cache;

process.env.NODE_ENV = 'development';

// change NODE_ENV between tasks.
gulp.task('prod', function() {
  return Promise.resolve(process.env.NODE_ENV = 'production');
});

gulp.task('dev', function() {
  return Promise.reoslve(process.env.NODE_ENV = 'development');
});

function buildPage(data) {
  const env = {
    isProduction: process.env.NODE_ENV === 'production'
  };
  const context = Object.assign(data, {env});
  const dest = path.resolve(process.cwd(), `.tmp/${data.name}.html`);

  return render(data.template, context)
    .then(html => {
      if (process.env.NODE_ENV === 'production') {
        console.log('Inlining source')
        return inline(html, {
          compress: true,
          rootpath: path.resolve(process.cwd(), '.tmp')
        });
      }    
      return Promise.resolve(html);
    })
    .then(html => {
      return fs.writeAsync(dest, html);
    })
    .catch(err => {
      throw err;
    });
}

gulp.task('html', () => {
  return loadJsonFile('origami.json')
    .then(json => {
      return Promise.all(json.demos.map(demo => {
        return buildPage(demo);
      })); 
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
    .pipe(browserSync.stream({once: true}));
});

gulp.task('scripts', () => {
  
  return rollup({
    entry: 'demos/src/demo.js',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ],
    cache: cache
  }).then(function(bundle) {
    // Cache for later use
    cache = bundle;

    // Or only use this
    return bundle.write({
      dest: '.tmp/scripts/demo.js',
      format: 'iife',
      sourceMap: true
    });
  })
  .then(() => {
    browserSync.reload();
  })
  .catch(err => {
    console.log(err);
  });
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', gulp.parallel('html', 'styles', 'scripts', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      index: 'share.html',
      directory: true,
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['demos/src/*.{html,json}', 'partials/*.html'], gulp.parallel('html'));

  gulp.watch('demos/src/*.scss',gulp.parallel('styles'));
  gulp.watch([
    'demos/src/*.js',
    'src/js/*.js'],
    gulp.parallel('scripts')
  );
}));

gulp.task('build', gulp.parallel('html', 'styles', 'scripts'));

gulp.task('copy', () => {
  const DEST = path.resolve(__dirname, demosDir);
  console.log(`Deploying to ${DEST}`);
  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
});

gulp.task('stats', () => {
  return stats({
      outDir: demosDir
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('demo', gulp.series('prod', 'clean', 'build', 'copy', 'dev'));