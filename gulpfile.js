'use strict';

let bump          = require('gulp-bump');
let file          = require('gulp-file');
let fs            = require('fs');
let gulp          = require('gulp');
let gutil         = require('gulp-util');
let jade          = require('gulp-jade');
let jspm          = require('gulp-jspm');
let rename        = require('gulp-rename');
let run           = require('run-sequence');
var s3            = require('gulp-s3-upload')({useIAM:true});
let shell         = require('gulp-shell');
let sourcemaps    = require('gulp-sourcemaps');

// Public tasks (serial)
gulp.task('deploy', (cb) => run('build:dist', 'preinstall:dist', 'install:dist', 'postinstall:dist', cb));
gulp.task('start', (cb) => run('build:dev', 'server:dev', cb));
gulp.task('start:dist', (cb) => run('build:dist', 'server:dist', cb));
gulp.task('test', (cb) => run('server:test', cb));

// Build tasks (parallel)
gulp.task('build:dev', (cb) => run(['jade:index:dev', 'jspm:bundle:dev'], cb));
gulp.task('build:dist', (cb) => run(['copy:assets:dist', 'copy:vendor:dist', 'jade:index:dist', 'jspm:bundle:dist'], cb));

// Deploy tasks (serial)
gulp.task('install:dist', (cb) => run('push:s3:dist', cb));
gulp.task('preinstall:dist', (cb) => run('version:bump', 'version:mark:dist', cb));
gulp.task('postinstall:dist', (cb) => run('push:s3:version', cb));

// Server tasks
gulp.task('server:dev', shell.task(['lite-server --config=config/dev.bs.config.json']));
gulp.task('server:dist', shell.task(['lite-server --config=config/dist.bs.config.json']));
gulp.task('server:test', shell.task(['lite-server --config=config/test.bs.config.json']));

// JSPM bundle tasks
gulp.task('jspm:bundle:dev', shell.task([
  'jspm bundle src/main - [src/app/**/*] ./.dev/vendor.js --inject'
]));

gulp.task('jspm:bundle:dist', (callback) => {
  return gulp
    .src('./src/main.ts')
    .pipe(sourcemaps.init())
      .pipe(jspm({ selfExecutingBundle: true, minify: true, mangle: false }))
      .pipe(rename('embed.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./.dist/scripts/'));
});

// Jade compile tasks
gulp.task('jade:index:dev', (callback) => {
  return gulp
    .src('./src/index.jade')
    .pipe(jade({ locals: { release: false } }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('jade:index:dist', (callback) => {
  return gulp
    .src('./src/index.jade')
    .pipe(jade({ locals: { release: true } }))
    .pipe(gulp.dest('./.dist/'));
});

// Copy tasks
gulp.task('copy:assets:dist', (callback) => {
  return gulp
    .src(['./src/**/*.html', '!./src/index.html', './src/**/*.css', './src/images/**/*'], { base: 'src' })
    .pipe(gulp.dest('./.dist/'));
});

gulp.task('copy:vendor:dist', (callback) => {
  return gulp
    .src('./node_modules/angular2/bundles/angular2-polyfills.js')
    .pipe(gulp.dest('./.dist/scripts/'));
});

// Utility tasks
gulp.task('push:s3:dist', (callback) => {
  return gulp
    .src(['./.dist/**', '!./.dist/version.deploy'])
    .pipe(s3({ Bucket: 'embed.prx.org' }));
});

gulp.task('push:s3:version', (callback) => {
  return gulp
    .src('./.dist/version.deploy')
    .pipe(s3({ Bucket: 'embed.prx.org' }));
});

gulp.task('version:bump', (callback) => {
  return gulp
    .src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('version:mark:dist', function (callback) {
  let pkg = require('./package.json');
  return file('version.deploy', pkg.version, { src: true })
    .pipe(gulp.dest('./.dist/'));
});
