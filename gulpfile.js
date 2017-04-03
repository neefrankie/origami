const pify = require('pify');
const path = require('path');
const fs = require('fs-jetpack');
const loadJsonFile = require('load-json-file');
const inline = pify(require('inline-source'));
const nunjucks = require('nunjucks');
nunjucks.configure(process.cwd(), {
  noCache: true,
  watch: false
});
const render = pify(nunjucks.render);
const stats = require('@ftchinese/component-stats');
const junk = require('junk');

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const fav = require('./lib/fav.js');
const logoImages = require('./lib/index.js');

const svgDir = path.resolve(__dirname, 'svg');
const deployDir = path.resolve(__dirname, '../ft-interact');
const demoDir = `${deployDir}/demos/${path.basename(__dirname)}`;

process.env.NODE_ENV = 'development';

// change NODE_ENV between tasks.
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
        console.log('Inlining source');
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

// /* demo tasks */
gulp.task('html', async () => {
  const env = {
    isProduction: process.env.NODE_ENV === 'production'
  };

  try {
    const [json, filenames] = await Promise.all([
      loadJsonFile('origami.json'),
      fs.listAsync(svgDir)
    ]);

    const logos = filenames.filter(junk.not).map(name => {
      return path.basename(name, '.svg');
    });

    const promisedAction = json.demos.map(demo => {
      const context = Object.assign(demo, {logos, env});
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
  const dest = '.tmp/styles';

  return gulp.src('demos/src/demo.scss')
    .pipe($.changed(dest))
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
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('clean', () => {
  return del(['.tmp/**']).then(()=>{
    console.log('Old files deleted');
  });
});

// build images
gulp.task('logos', () => {
  return logoImages()
  .catch(err => {
    console.log(err);
  })
});

gulp.task('favicons', () => {
  return fav({
      imageDir: 'public/favicons',
      htmlDir: 'demos/src'
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('build', gulp.parallel('logos', 'favicons'));

// Test and watch
gulp.task('serve', gulp.parallel('logos', 'favicons', 'html', 'styles', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'public'],
      directory: true,
      routes: {
        '/dist': 'dist'
      }
    }
  });

  gulp.watch(['demos/src/*.{html,json}', 'origami.json'], gulp.parallel('html'));

  gulp.watch([
    'demos/src/*.scss',
    'src/scss/*.scss',
    '*.scss'],
    gulp.parallel('styles')
  );

  gulp.watch('svg/*.svg', gulp.parallel('logos'));
}));

// Deploy
gulp.task('copy:images', () => {
  console.log(`Deploy to ${deployDir}`);
  return gulp.src('public/**/*')
    .pipe(gulp.dest(deployDir));
});
gulp.task('deploy', gulp.series('build', 'copy:images'));

// Produce demo
gulp.task('stats', () => {
  return stats({
      outDir: demoDir
    })
    .catch(err => {
      console.log(err);
    });
});

gulp.task('copy:demo', () => {
  console.log(`Deploying to ${demoDir}`);
  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(demoDir));
});

gulp.task('demo', gulp.series('clean', 'prod', 'styles', 'html', 'stats', 'copy:demo', 'dev'));