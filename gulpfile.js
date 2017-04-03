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

function buildPage(template, context) {
  return render(template, context)
    .then(html => {
      if (process.env.NODE_ENV === 'production') {
        return inline(html, {
          compress: true,
          rootpath: path.resolve(process.cwd(), '.tmp')
        });
      }    
      return html;      
    })
    .catch(err => {
      throw err;
    });
}

// The data is used to render nunjucks templates.
const share = {
  title: encodeURIComponent("FTC share components"),
  url: encodeURIComponent("http://interactive.ftchinese.com/components/ftc-share.html"),
  summary: encodeURIComponent("This is the demo page for ftc share component")
};

gulp.task('html', async function () {
  const env = {
    isProduction: process.env.NODE_ENV === 'production'
  };
  try {
    const origami = await loadJsonFile('origami.json');

    const promisedAction = origami.demos.map(demo => {
      const context = Object.assign(demo, {share, env});
      return buildPage(demo.template, context)  
        .then(html => {
          return fs.writeAsync(`.tmp/${demo.name}.html`, html);
        });
    });

    await promisedAction;
    browserSync.reload('*.html');
  } catch (e) {
    console.log(e);
  }
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

gulp.task('stats', () => {
  return stats({
      outDir: demosDir
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('build', gulp.parallel('html', 'styles', 'scripts'));

gulp.task('copy', () => {
  console.log(`Deploying to ${demosDir}`);
  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(demosDir));
});

gulp.task('demo', gulp.series('prod', 'clean', 'build', 'copy', 'stats', 'dev'));