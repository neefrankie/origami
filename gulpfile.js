var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var del = require('del');
var imageResize = require('gulp-image-resize');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var handlebars = require('handlebars');

gulp.task('clean', function() {
	del(['dist/*']);
});

gulp.task('dist', ['clean'], function() {
	return gulp.src('src/share.js')
		.pipe(gulp.dest('dist/'))
		.pipe(rename('share.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/'));
});

//produce sprite icon.
//Make sure GraphicsMagick or ImageMagick is installed on your system and properly set up in your PATH before using `resize`.
gulp.task('icon-resize', function() {
  return gulp.src('icons/*.png')
    .pipe(imageResize({
      width: 20,
      crop:false
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('sprite', ['icon-resize'], function() {
  var spriteData = gulp.src('.tmp/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      algorithm: 'top-down',
      padding: 4,
      cssTemplate: 'template/hb.css.handlebars'
    }));
  var imgStream = spriteData.img
    .pipe(gulp.dest('./test/images/'));

  var cssStream = spriteData.css
    .pipe(gulp.dest('./test/styles/'));

  return merge(imgStream, cssStream);
});