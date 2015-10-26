var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('clean', function() {
	del(['dist/*']);
});

gulp.task('dist', ['clean'], function() {
	return gulp.src('src/share.js')
		.pipe(gulp.dest('dist/'))
		.pipe(rename('share.min.js'))
		.pipe(gulp.dest('dist/'));
});