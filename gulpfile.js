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

//const webpack = require('webpack');
//const webpackConfig = require('./webpack.config.js');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const rollupUglify = require('rollup-plugin-uglify');
const minifyEs6 = require('uglify-es').minify;
const demosDir = '../ft-interact/demos';
const projectName = path.basename(__dirname);
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

/*
gulp.task('readOrigamiData', async() => {
  const origami = await fs.readAsync('origami.json','json');
  const demos = origami.demos;
});
*/
gulp.task('html', async () => {
  var embedded = false;
  const destDir = '.tmp';
  if (process.env.NODE_ENV === 'prod') {
    embedded = true;
  }
  const origami = await fs.readAsync('origami.json','json');
  const demos = origami.demos;
  //console.log(demos);
  
  function renderOneView(demo) {
    console.log(demo);
    return new Promise (
      async function (resolve, reject)  {
         const template = demo.template;
         const name = demo.name;
         const dataPath = demo.data;
         const dataForHeader = await fs.readAsync(dataPath,'json');
         const context = {
            pageTitle: demo.name,
            description: demo.description,
            js: demo.js,
            css: demo.css,
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
    gulp.src('.tmp/*.html')
      .pipe(gulp.dest('demos/htmlresults'));
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

/*
gulp.task('eslint', () => {
  return gulp.src('client/js/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});
*/
// Old Method:
/*
gulp.task('script',() => {
  // TODO:关于rollup需要再认真学习一下
   return rollup({
     input:'demos/src/main.js',
     cache: cache,
     plugins:[
       babel({//这里需要配置文件.babelrc
         exclude:'node_modules/**'
       }),
       nodeResolve({
         jsnext:true,
       })
      // rollupUglify({}, minifyEs6)//压缩es6代码
     ]
   }).then(function(bundle) {
     cache = bundle;//Cache for later use
     return bundle.write({//返回promise，以便下一步then()
       file: '.tmp/scripts/main.js',
       format: 'iife',
       sourcemap: true
    });
   }).then(() => {
     browserSync.reload();
   }).catch(err => {
     console.log(err);
   });
});
*/

gulp.task('scripts', async () => {
  // TODO:关于rollup需要再认真学习一下
  const origami = await fs.readAsync('origami.json','json');
  const demos = origami.demos;
  async function rollupOneJs(demo) {
    const bundle = await rollup({
      input:`demos/src/${demo.js}`,
      plugins:[
        babel({//这里需要配置文件.babelrc
          exclude:'node_modules/**'
        }),
        nodeResolve({
          jsnext:true,
        })
      // rollupUglify({}, minifyEs6)//压缩es6代码
      ]
    });

    await bundle.write({//返回promise，以便下一步then()
        file: `.tmp/scripts/${demo.js}`,
        format: 'iife',
        sourcemap: true
    });
  }
  //console.log(demos);
  await demos.forEach(rollupOneJs);
  browserSync.reload();
});



gulp.task('clean', function() {
  return del(['.tmp/**']);
});

gulp.task('serve', gulp.series('clean','html', 'styles', 'scripts', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      index: 'header.html',
      directory: true,
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch(['demos/html/**/*.html', 'demos/data/*.json'], gulp.parallel('html'));

  gulp.watch(['src/scss/**/*.scss', 'demos/src/main.scss'], gulp.parallel('styles'));
  gulp.watch(['src/js/**/*.js','demos/src/*.js','./main.js'], gulp.parallel('scripts'));
}));

gulp.task('build', gulp.parallel('clean', 'html', 'styles', 'scripts'));

