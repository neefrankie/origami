const pify = require('pify');
const fs = require('fs-jetpack');
const path = require('path');
const loadJsonFile = require('load-json-file');
const inline = pify(require('inline-source'));
const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const nunjucks = require('nunjucks');
nunjucks.configure(process.cwd(), {
  noCache: true,
  watch: false
});
const render = pify(nunjucks.render);

const socialImages = require('./lib/index.js');

const deployDest = path.resolve(__dirname, '../ft-interact/social-images');

const images = [
  "wechat",
  "weibo",
  "linkedin",
  "facebook",
  "twitter"
];

process.env.NODE_ENV = 'development';

// change NODE_ENV between tasks.
gulp.task('prod', function() {
  return Promise.resolve(process.env.NODE_ENV = 'production');
});

gulp.task('dev', function() {
  return Promise.resolve(process.env.NODE_ENV = 'development');
});

// minify svg
gulp.task('svgmin', () => {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe(gulp.dest('svg'));
});

function buildPages(demos) {
  const env = {
    isProduction: process.env.NODE_ENV === 'production'
  };

  return Promise.all(demos.map(demo => {
    return render(demo.template, {images, env})
      .then(html => {
        if (process.env.NODE_ENV === 'production') {
          return inline(html, {
            compress: true,
            rootpath: path.resolve(process.cwd(), '.tmp')
          });
        }    
        return html;      
      })    
      .then(html => {
        return fs.writeAsync(`.tmp/${demo.name}.html`, html);
      })
      .catch(err => {
        throw err;
      });
  }));
}

gulp.task('html', () => {
  return loadJsonFile('origami.json')
    .then(json => {
      return buildPages(json.demos)
    })
    .then(() => {
      browserSync.reload('*.html');
      return Promise.resolve();
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('styles', () => {
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

gulp.task('clean', () => {
  return del(['.tmp/**']).then(()=>{
    console.log('.tmp directory deleted');
  });
});

gulp.task('serve', gulp.parallel('html', 'styles', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp'],
      directory: true,
      routes: {
        '/dist': 'dist'
      }
    }
  });

  gulp.watch(['demos/src/*.html', 'origami.json'], gulp.parallel('html'));

  gulp.watch([
    'demos/src/*.scss',
    'src/scss/*.scss',
    '*.scss'],
    gulp.parallel('styles')
  );

}));

gulp.task('copy', () => {
  const dest = path.resolve(__dirname, '../ft-interact/demos/ftc-social-images');
  console.log(`Deploying to ${dest}`);
  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(dest));
});

gulp.task('demo', gulp.series('clean', 'prod', 'styles', 'html', 'copy', 'dev'));

gulp.task('deploy', () => {

  return Promise.all([
    socialImages({
      to: `${deployDest}/default`
    }),
    socialImages({
      to: deployDest,
      png: false,
      color: null,
      background: null
    })
  ])
  .catch(err => {
    console.log(err);
  });
});

