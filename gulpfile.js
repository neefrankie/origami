const fs = require('fs');
const path = require('path');
const url = require('url');
const isThere = require('is-there');
const co = require('co');
const mkdirp = require('mkdirp');
const helper = require('./helper');

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const cssnext = require('postcss-cssnext');
const $ = require('gulp-load-plugins')();

const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const bowerResolve = require('rollup-plugin-bower-resolve');

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const data = require('./lib/data.js');

const projectName = 'ftc-footer';
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

const demos = [
  {
    tmpl: 'demo-index.html',
    title: 'index',
    name: 'index.html',
  }, 
  {
    tmpl: 'demo-full.html',
    title: 'footer',
    name: 'dark-theme.html'
  }, 
  {
    tmpl: 'demo-full.html',
    title: 'footer-light',
    name: 'light-theme.html',
    theme: 'theme-light'
  }, 
  {
    tmpl: 'demo-simple.html',
    title: 'simple-footer',
    name: 'simple-footer.html',
    theme: 'theme-light'
  }
];

gulp.task('html', () => {
  return co(function *() {
    const destDir = '.tmp';

    if (!isThere(destDir)) {
      mkdirp(destDir, (err) => {
        if (err) console.log(err);
      });
    }

    // const data = yield helper.readJson('demos/src/footer.json');

    const htmlString = yield Promise.all(demos.map(function(current, i, array) {
      var context = {};
      if (current.title === 'index') {
        context.demos = array.slice(1);
      } else {
        context = Object.assign(data, current)
      }
      return helper.render(current.tmpl, context)
    }));

    demos.forEach(function(current, i) {
      const htmlFile = fs.createWriteStream('.tmp/' + current.name);
      htmlFile.write(htmlString[i]);
      htmlFile.on('error', (error) => {
        console.log(error);
      });
    });     
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
    .pipe($.size({
      gzip: true,
      showFiles: true
    }))
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

gulp.task('webpack', function(done) {
// change webpack config if env is production.
  if (process.env.NODE_ENV === 'prod') {
    delete webpackConfig.watch;
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin())
  }

  webpack(webpackConfig, function(err, stats) {
    if (err) throw new $.util.PluginError('webpack', err);
    $.util.log('[webpack]', stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }))
    browserSync.reload('demo.js');
    done();
  });
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', 
  gulp.parallel(
    'html', 'styles', 'webpack',
    function serve() {
    browserSync.init({
      server: {
        baseDir: ['.tmp'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch('demos/src/*.{html,json}', gulp.parallel('html'));

    gulp.watch(['demos/src/*.scss', '*.scss', 'src/**/*.scss'], gulp.parallel('styles'));
  })
);

gulp.task('copy', () => {
  const DEST = path.resolve(__dirname, '../ft-interact', projectName);
  console.log(`Deploying to ${DEST}`);
  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('prod', 'clean', gulp.parallel('html', 'styles', 'webpack'), 'copy'));


gulp.task('bump', () => {
  return gulp.src(['package.json', 'bower.json'])
    .pipe($.bump({version: '1.2.3'}))
    .pipe(gulp.dest('./'))
})