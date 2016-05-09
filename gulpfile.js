'use strict';

const gulp          = require('gulp');
const jspm          = require('gulp-jspm');
const karma         = require('karma').Server
const rename        = require('gulp-rename');
const run           = require('run-sequence');
const shell         = require('gulp-shell');
const sourcemaps    = require('gulp-sourcemaps');

// Public tasks (serial)
gulp.task('git:hooks:pre-commit', cb => run('jspm:unbundle', cb));
gulp.task('postinstall', cb => run(['jspm:install', 'typings:install', 'git:hooks:install'], cb));
gulp.task('start:dev', cb => run('build:dev', 'server:dev', cb));
gulp.task('start:dist', cb => run('build:dist', 'server:dist', cb));

// Build tasks (parallel)
gulp.task('build:dev', cb => run(['jspm:bundle:dev'], cb));
gulp.task('build:dist', cb => run(['jspm:bundle:dist'], cb));

// Server tasks
gulp.task('server:dev', shell.task(['node ./server/dev.js']));
gulp.task('server:dist', shell.task(['node ./server/dist.js']));

// JSPM bundle tasks
gulp.task('jspm:bundle:dev', shell.task([
  'jspm bundle src/app/main - [src/app/**/*] - [src/lib/**/*] - [src/javascript/**/*] ./.dev/vendor.js --inject'
]));

gulp.task('jspm:bundle:dist', () => {
  return gulp
    .src('./src/app/main.ts')
    .pipe(sourcemaps.init())
    .pipe(jspm({ selfExecutingBundle: true, minify: true, mangle: false }))
    .pipe(rename('embed.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./.dist/scripts/'));
});

gulp.task('jspm:install', shell.task(['jspm install']));

gulp.task('jspm:unbundle', shell.task([
  `(git diff --name-only --cached | grep config/systemjs.config.js > /dev/null &&
   (jspm unbundle; git add config/systemjs.config.js)) || true`
]));

// Testing tasks
gulp.task('tdd', function (done) {
  new karma({
    configFile: __dirname + '/config/karma.dev.js'
  }, done).start();
});

// Utility tasks
const loc = ['#!/bin/sh', 'PATH="/usr/local/bin:$PATH"', 'npm run git:hooks:pre-commit'];
gulp.task('git:hooks:install', shell.task([
  `printf '${loc.join('\n')}' > ./.git/hooks/pre-commit`,
  'chmod +x ./.git/hooks/pre-commit'
]));

gulp.task('typings:install', shell.task(['typings install']));
