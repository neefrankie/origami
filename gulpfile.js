const fs = require('fs');
const path = require('path');
const isThere = require('is-there');
const co = require('co');
const mkdirp = require('mkdirp');
const str = require('string-to-stream');
const helper = require('./lib/helper');

const del = require('del');
const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const socialList = require('./social-list.json');

const socialNames = socialList.map(item => item.name);

var themeNames = socialList.map(item => {
  const name = item.name;
  const themes = Object.keys(item.themes);
  return themes.map(theme => {
    return (theme === 'default') ? item.name : `${item.name}-${theme}`;
  });
});

themeNames = helper.zip(themeNames);

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

// minify svg
gulp.task('svgmin', () => {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe(gulp.dest('svg'));
});

// generate nunjucks templates for image-services.
gulp.task('templates', () => {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe($.cheerio({
      run: function($, file) {
        $('.background').attr('fill', '{{background}}');
        $('.foreground').attr('fill', '{{foreground}}');
      }
    }))
    .pipe(gulp.dest('templates'));
});

gulp.task('sassvg', function() {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe($.cheerio({
      run: function($, file) {
        $('.background').remove();
        $('.foreground').removeAttr('fill')
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe($.sassvg({
      outputFolder: 'src/scss',
      optimizeSvg: true
    }));
});

gulp.task('svgstore', () => {
  return gulp.src('svg/*.svg')
    .pipe($.svgmin())
    .pipe($.cheerio({
      run: function($, file) {
        $('.background').remove();
        $('.foreground').removeAttr('fill')
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe($.svgstore())
    .pipe($.rename('all.svg'))
    .pipe(gulp.dest('static/sprite'))
});

gulp.task('build', gulp.parallel('svgmin', 'templates', 'svgstore', 'sassvg'));

// /* demo tasks */
gulp.task('html', () => {
// determine whether include `/api/resize-iframe.js` listed in `ftc-components`.
  var embedded = false;

  return co(function *() {
    const destDir = '.tmp';

    if (!isThere(destDir)) {
      mkdirp(destDir, (err) => {
        if (err) console.log(err);
      });
    }
    if (process.env.NODE_ENV === 'prod') {
      embedded = true;
    }

    const origami = yield helper.readJson('origami.json');

    const demos = origami.demos;

    const htmlString = yield Promise.all(demos.map(function(demo) {

      const template = demo.template;
      console.log(`Using template "${template}" for "${demo.name}"`);

      const context = {
        pageTitle: demo.name,
        description: demo.description,
        socialNames: socialNames,
        themeNames: themeNames,
        embedded: embedded
      };

      return helper.render(template, context);
    }));

    demos.forEach(function(demo, i) {
      str(htmlString[i])
        .pipe(fs.createWriteStream('.tmp/' + demo.name + '.html'));
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

gulp.task('clean', function() {
  return del(['.tmp/**']).then(()=>{
    console.log('Old files deleted');
  });
});

gulp.task('serve', gulp.parallel('html', 'styles', () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp', '.'],
      directory: true,
      routes: {
        '/bower_components': 'bower_components'
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
  const DEST = path.resolve(__dirname, demosDir, projectName);
  console.log(`Deploying to ${DEST}`);
  return gulp.src(['.tmp/**/*', 'static*/**/*.{svg,png}', 'svg*/*.svg'])
    .pipe(gulp.dest(DEST));
});

gulp.task('demo', gulp.series('clean', 'prod', gulp.parallel('html', 'styles'), 'copy', 'dev'));
