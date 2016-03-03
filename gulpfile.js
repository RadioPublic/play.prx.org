var fs            = require('fs');
var gulp          = require('gulp');
var rename        = require('gulp-rename');
var runSequence   = require('run-sequence');
var sourcemaps    = require('gulp-sourcemaps');
var jspm          = require('gulp-jspm');
var jade          = require('gulp-jade');
var s3            = require('gulp-s3');

gulp.task('dev', function (callback) {
  runSequence(
    'compileDevIndex'
  );
});

gulp.task('compileDevIndex', function (callback) {
  return gulp
    .src('./src/index.jade')
    .pipe(jade({ locals: { release: false } }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('compileProductionIndex', function (callback) {
  return gulp
    .src('./src/index.jade')
    .pipe(jade({ locals: { release: true } }))
    .pipe(gulp.dest('./src/'));
});
