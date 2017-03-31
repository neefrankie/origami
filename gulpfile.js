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
const junk = require('junk');

const fav = require('./lib/fav.js');
const logoImages = require('./lib/index.js');

const svgDir = path.resolve(__dirname, 'svg');
const targetDir = path.resolve(__dirname, '../ft-interact');
const demoDir = `${targetDir}/demos`;
const project = path.basename(__dirname);

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

gulp.task('images', () => {
  return Promise.all([
    logoImages(),
    fav({htmlTo: path.resolve(process.cwd(), 'public/favicons')})
  ])
  .catch(err => {
    console.log(err);
  })
});

gulp.task('clean', () => {
  return del(['.tmp/**']).then(()=>{
    console.log('Old files deleted');
  });
});

gulp.task('serve', gulp.parallel('images', 'html', 'styles', () => {
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

  gulp.watch('svg/*.svg', gulp.parallel('images'));

}));

gulp.task('copy', () => {
  const dest = `${demoDir}/${project}`;
  console.log(`Deploying to ${dest}`);
  return gulp.src('.tmp/*.html')
    .pipe(gulp.dest(dest));
});

gulp.task('demo', gulp.series('clean', 'prod', 'styles', 'html', 'copy', 'dev'));

gulp.task('deploy', () => {
  return Promise.all([
      logoImages(`${targetDir}/${project}`),
      fav({
        imageTo: `${targetDir}/favicons`,
        htmlTo: null
      })
    ])
    .catch(err => {
      console.log(err);
    });
});
