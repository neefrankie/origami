const fs = require('fs-jetpack');
const path = require('path');
const co = require('co');
// const deepMerge = require('deepmerge');
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
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');

const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);

const share = {
  title: encodeURIComponent("FTC share components"),
  url: encodeURIComponent("http://interactive.ftchinese.com/components/ftc-share.html"),
  summary: encodeURIComponent("This is the demo page for ftc share component")
};

var cache;

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
  return co(function *() {
    const destDir = '.tmp';

    const embedded = process.env.NODE_ENV === 'prod';

    const origami = yield fs.readAsync('origami.json', 'utf8');

    const demos = JSON.parse(origami).demos;

    const renderResults = yield Promise.all(demos.map(demo => {

      const context = deepMerge({share}, demo);
      Object.assign(context, {embedded});

      return render(demo.template, context, demo.name);
    }));

    yield mkdir(destDir);

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

gulp.task('eslint', () => {
  return gulp.src('client/js/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
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


// dist js to be directly used in the browser.
gulp.task('build:node', () => {
  return rollup({
    entry: './src/js/get-socials.js',
    cache: cache,
  }).then(function(bundle) {
    return bundle.write({
      format: 'cjs',
      dest: 'lib/get-socials.js',
    });
  });
});

// Transpiled with babel but keeps import/export to be used by rollup or webpack.
// Transpile it so that when used as dependecy, build tools do not need to re-transpile it on every change.
// Keeps import/export so that it could be used as a module.
gulp.task('build:module', () => {
  return rollup({
    entry: './main.js',
    plugins: [
      buble()
    ]
  }).then(function(bundle) {
    return bundle.write({
      dest: 'dist/share.es2015.js',
      format: 'es'
    });
  })
  .catch(err => {
    console.log(err);
  });
})

// IIFE that can be run directly in browser
gulp.task('build:browser', () => {
  return rollup({
    entry: './main.js',
    plugins: [
      buble()
    ]
  }).then(function(bundle) {
    return bundle.write({
      dest: 'dist/share.browser.js',
      format: 'iife',
      moduleName: 'Share'
    });
  })
  .catch(err => {
    console.log(err);
  });
})
