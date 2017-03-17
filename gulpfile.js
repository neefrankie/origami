const path = require('path');
const fs = require('fs-jetpack');
const loadJsonFile = require('load-json-file');
const _ = require('lodash');
const nunjucks = require('nunjucks');

function render(template, context) {
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(
      [process.cwd()],
      {noCache: true}
    ),
    {autoescape: false}
  );

  return new Promise(function(resolve, reject) {
    env.render(template, context, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');

const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);

// The data is used to render nunjucks templates.
const share = {
  title: encodeURIComponent("FTC share components"),
  url: encodeURIComponent("http://interactive.ftchinese.com/components/ftc-share.html"),
  summary: encodeURIComponent("This is the demo page for ftc share component")
};

var cache;

process.env.NODE_ENV = 'development';

// change NODE_ENV between tasks.
gulp.task('prod', function() {
  return Promise.resolve(process.env.NODE_ENV = 'production');
});

gulp.task('dev', function() {
  return Promise.reoslve(process.env.NODE_ENV = 'development');
});

async function buildPages() {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const origami = await loadJsonFile('origami.json');
    const demos = origami.demos;

    await Promise.all(demos.map(demo => {
      const dest = `.tmp/${demo.name}.html`;

      const context = _.merge({share}, demo, {isProduction});

      return render(demo.template, context)
        .then(html => {
          console.log(`Generating page ${dest}`);
          return fs.writeAsync(dest, html)
        })
        .catch(err => {
          throw err;
        });
    })); 

  } catch(e) {
    throw e;
  }
}
gulp.task('html', () => {
  return buildPages()
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

  gulp.watch([
    'demos/src/*.{html,json}', 
    'partials/*.html'], 
    gulp.parallel('html')
  );

  gulp.watch([
    'demos/src/*.scss',
    'src/scss/*.scss',
    '*.scss'],
    gulp.parallel('styles')
  );

  gulp.watch([
    'demos/src/*.js',
    'src/js/*.js'],
    gulp.parallel('scripts')
  );

}));

gulp.task('build', gulp.parallel('html', 'styles', 'scripts'));

gulp.task('copy', () => {
  const DEST = path.resolve(__dirname, demosDir, projectName);
  console.log(`Deploying to ${DEST}`);
  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('prod', 'clean', 'build', 'copy', 'dev'));