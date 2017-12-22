const promisify = require('promisify-node');//Wraps Node modules, functions, and methods written in the Node-callback style to return Promises.
const fs = require('fs-jetpack');

const path = require('path');
const nunjucks = require('nunjucks');

const isThere = require('is-there');
const mkdirp = require('mkdirp');

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

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


/**********Nunjucks渲染环境配置：start*********/
var env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(
    [
      path.resolve(process.cwd(), 'demos/html')
    ],
    {
      watch:false,
      noCache: true
    }
  ),
  {autoescape: false}
);

function render(template, context) {
  return new Promise(function(resolve, reject) {
    env.render(template, context, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

gulp.task('html', async () => {
  var embedded = false;
  const destDir = '.tmp';
  if (process.env.NODE_ENV === 'prod') {
    embedded = true;
  }
  const origami = await fs.readAsync('origami.json','json');
  const demos = origami.demos;
  console.log(demos);
  
  function renderOneView(demo) {
    console.log(demo);
    return new Promise (
      async function (resolve, reject)  {
         const template = demo.template;
         const name = demo.name;
         const dataPath = demo.data;
         const dataForHeader = await fs.readAsync('demos/data/header.json','json');
         const context = {
            pageTitle: demo.name,
            description: demo.description,
            header: dataForHeader,
            embedded: embedded
         };
         const renderResult = await render(template, context);
         const destFile = path.resolve(destDir, `${name}.html`);
         const result = {
           renderResult,
           destFile
         };
         resolve(result);
      }
    ).then(result => {
      fs.writeAsync(result.destFile, result.renderResult);
    }).catch(error => {

    })
  }

  return Promise.all(demos.map((demo) => {
    return renderOneView(demo);
  })).then(() => {
    browserSync.reload('*.html');
  }).catch(error => {
    console.log(error);
  })
  
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

gulp.task('eslint', () => {
  return gulp.src('client/js/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('webpack', (done) => {
  if (process.env.NODE_ENV === 'prod') {
    delete webpackConfig.watch;
  }

  webpack(webpackConfig, function(err, stats) {
    if (err) throw new $.util.PluginError('webpack', err);
    $.util.log('[webpack]', stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload('scripts/main.js');
    done();
  });
});

gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', gulp.series('html', 'styles', 'webpack', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      index: 'header.html',
      directory: false,
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['demos/html/*.html', 'demos/data/*.json'], gulp.parallel('html'));

  gulp.watch(['src/scss/**/*.scss','demos/src/main.scss'],gulp.parallel('styles'));
  gulp.watch('src/*.js',gulp.parallel('webpack'));
}));

gulp.task('build', gulp.parallel('html', 'styles', 'webpack'));

gulp.task('copy', () => {
  const DEST = path.resolve(__dirname, demosDir, projectName);
  console.log(`Deploying to ${DEST}`);
  return gulp.src('.tmp/**/*')
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('prod', 'clean', 'build', 'copy', 'dev'));