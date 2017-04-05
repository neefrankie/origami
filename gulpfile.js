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
const buble = require('rollup-plugin-buble');

const demosDir = path.resolve(process.cwd(), `../ft-interact/demos/${path.basename(__dirname)}`);

let cache;

// change NODE_ENV between tasks.
process.env.NODE_ENV = 'development';

gulp.task('prod', function() {
  return Promise.resolve(process.env.NODE_ENV = 'production');
});

gulp.task('dev', function() {
  return Promise.resolve(process.env.NODE_ENV = 'development');
});

// The data is used to render nunjucks templates.
const share = {
  title: encodeURIComponent("FTC share components"),
  url: encodeURIComponent("http://interactive.ftchinese.com/components/ftc-share.html"),
  summary: encodeURIComponent("This is the demo page for ftc share component")
};

function buildPage(data) {
  const env = {
    isProduction: process.env.NODE_ENV === 'production'
  };
  const context = Object.assign(data, {share, env});
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

gulp.task('scripts', () => {
  const dest = '.tmp/scripts/demo.js';
  return rollup({
    entry: 'demos/src/demo.js',
    plugins: [
      buble()
    ],
    cache: cache
  }).then(function(bundle) {
    cache = bundle;
    return bundle.write({
      dest: '.tmp/scripts/demo.js',
      format: 'iife',
      sourceMap: true
    });
  })
  .then(() => {
    browserSync.reload();
    return Promise.resolve();
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

  gulp.watch(['demos/src/*.{html,json}', 
'partials/*.html'], gulp.parallel('html'));

  gulp.watch(['demos/src/*.scss', 'src/scss/*.scss', '*.scss'], gulp.parallel('styles'));

  gulp.watch(['demos/src/*.js', 'src/js/*.js'],gulp.parallel('scripts'));
}));

gulp.task('build', gulp.series('prod', 'clean', gulp.parallel('styles', 'scripts'), 'html'));

gulp.task('stats', () => {
  return stats({
      outDir: demosDir
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('copy:demo', () => {
  console.log(`Copying demo to ${demosDir}`);
  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(demosDir));
});

gulp.task('demo', gulp.series('build', 'copy:demo', 'stats'));