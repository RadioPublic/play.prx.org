'use strict';

const bump          = require('gulp-bump');
const file          = require('gulp-file');
const gulp          = require('gulp');
const jade          = require('gulp-jade');
const jspm          = require('gulp-jspm');
const rename        = require('gulp-rename');
const run           = require('run-sequence');
const s3            = require('gulp-s3-upload')({ useIAM: true });
const shell         = require('gulp-shell');
const sourcemaps    = require('gulp-sourcemaps');

// Public tasks (serial)
gulp.task('deploy', cb => run('build:dist', 'preinstall:dist', 'install:dist', 'postinstall:dist', cb));
gulp.task('git:hooks:pre-commit', cb => run('jspm:unbundle', cb));
gulp.task('postinstall', cb => run(['jspm:install', 'typings:install', 'git:hooks:install'], cb));
gulp.task('start', cb => run('build:dev', 'server:dev', cb));
gulp.task('start:dist', cb => run('build:dist', 'server:dist', cb));
gulp.task('test', cb => run('server:test', cb));

// Build tasks (parallel)
gulp.task('build:dev', cb => run(['jade:index:dev', 'jspm:bundle:dev'], cb));
gulp.task('build:dist', cb => run(['copy:assets:dist', 'copy:vendor:dist', 'jade:index:dist', 'jspm:bundle:dist'], cb));

// Deploy tasks (serial)
gulp.task('install:dist', cb => run('push:s3:dist', cb));
gulp.task('preinstall:dist', cb => run('version:bump', 'version:mark:dist', cb));
gulp.task('postinstall:dist', cb => run('push:s3:version', cb));

// Server tasks
gulp.task('server:dev', shell.task(['lite-server --config=config/dev.bs.config.json']));
gulp.task('server:dist', shell.task(['lite-server --config=config/dist.bs.config.json']));
gulp.task('server:test', shell.task(['lite-server --config=config/test.bs.config.json']));

// JSPM bundle tasks
gulp.task('jspm:bundle:dev', shell.task([
  'jspm bundle src - [src/app/**/*] - [src/lib/**/*] - [src/javascript/**/*] ./.dev/vendor.js --inject'
]));

gulp.task('jspm:bundle:dist', () => {
  return gulp
    .src('./src/main.ts')
    .pipe(sourcemaps.init())
    .pipe(jspm({ selfExecutingBundle: true, minify: true, mangle: false }))
    .pipe(rename('embed.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./.dist/scripts/'));
});

gulp.task('jspm:install', shell.task(['jspm install']));

gulp.task('jspm:unbundle', shell.task(['jspm unbundle']));

// Jade compile tasks
gulp.task('jade:index:dev', () => {
  return gulp
    .src('./src/index.jade')
    .pipe(jade({ locals: { dist: false } }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('jade:index:dist', () => {
  return gulp
    .src('./src/index.jade')
    .pipe(jade({ locals: { dist: true } }))
    .pipe(gulp.dest('./.dist/'));
});

// Copy tasks
gulp.task('copy:assets:dist', () => {
  return gulp
    .src(['./src/**/*.html', '!./src/index.html', './src/**/*.css', './src/images/**/*'], { base: 'src' })
    .pipe(gulp.dest('./.dist/'));
});

gulp.task('copy:vendor:dist', () => {
  return gulp
    .src('./node_modules/angular2/bundles/angular2-polyfills.js')
    .pipe(gulp.dest('./.dist/scripts/'));
});

// Utility tasks
const loc = ['#!/bin/sh', 'PATH="/usr/local/bin:$PATH"', 'npm run git:hooks:pre-commit'];
gulp.task('git:hooks:install', shell.task([
  `printf '${loc.join('\n')}' > ./.git/hooks/pre-commit`,
  'chmod +x ./.git/hooks/pre-commit'
]));

gulp.task('push:s3:dist', () => {
  return gulp
    .src(['./.dist/**', '!./.dist/version.deploy'])
    .pipe(s3({ Bucket: 'embed.prx.org' }));
});

gulp.task('push:s3:version', () => {
  return gulp
    .src('./.dist/version.deploy')
    .pipe(s3({ Bucket: 'embed.prx.org' }));
});

gulp.task('typings:install', shell.task(['typings install']));

gulp.task('version:bump', () => {
  return gulp
    .src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('version:mark:dist', () => {
  const pkg = require('./package.json');
  return file('version.deploy', pkg.version, { src: true })
    .pipe(gulp.dest('./.dist/'));
});
