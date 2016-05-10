'use strict';

const gulp          = require('gulp');
const jspm          = require('gulp-jspm');
const karma         = require('karma').Server
const rename        = require('gulp-rename');
const run           = require('run-sequence');
const shell         = require('gulp-shell');
const sourcemaps    = require('gulp-sourcemaps');

// Server tasks
gulp.task('postinstall', cb => run(process.env.NODE_ENV === 'production' ? 'postinstall:dist' : 'postinstall:dev', cb));
// gulp.task('postinstall:ci', cb => {});
gulp.task('postinstall:dev', cb => run(['jspm:install', 'typings:install', 'git:hooks:install'], cb));
gulp.task('postinstall:dist', cb => run('build', 'npm:prune', 'npm:cache:clean', cb));

gulp.task('prestart', cb => {
  if (process.env.CI) {
    run('prestart:ci', cb);
  } else if (process.env.NODE_ENV === 'production') {
    run('prestart:dist', cb);
  } else {
    run('prestart:dev', cb);
  }
});
gulp.task('prestart:ci', cb => run(cb));
gulp.task('prestart:dev', cb => run('build', cb));
gulp.task('prestart:dist', cb => run(cb));

gulp.task('start', cb => {
  if (process.env.CI) {
    run('start:ci', cb);
  } else if (process.env.NODE_ENV === 'production') {
    run('start:dist', cb);
  } else {
    run('start:dev', cb);
  }
});
gulp.task('start:ci', cb => run(cb));
gulp.task('start:dev', cb => run('server', cb));
gulp.task('start:dist', cb => run('server', cb));

// Build tasks
gulp.task('build', cb => run(process.env.NODE_ENV === 'production' ? 'build:dist' : 'build:dev', cb));
// gulp.task('build:ci', cb => {});
gulp.task('build:dev', cb => run(['jspm:bundle'], cb));
gulp.task('build:dist', cb => run(['jspm:bundle'], cb));

// Server tasks
gulp.task('server', cb => run(process.env.NODE_ENV === 'production' ? 'server:dist' : 'server:dev', cb));
gulp.task('server:dev', shell.task(['node ./server/dev.js']));
gulp.task('server:dist', shell.task(['node ./server/dist.js']));

// JSPM bundle tasks
gulp.task('jspm:bundle', cb => {
  if (process.env.NODE_ENV === 'production') {
    run('jspm:bundle:dist', cb);
  } else {
    run('jspm:bundle:dev', cb);
  }
});
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


// Public tasks (serial)
gulp.task('git:hooks:pre-commit', cb => run('jspm:unbundle', cb));

gulp.task('test:ci', cb => run('karma:ci', cb));
// gulp.task('test:once', cb => run(cb));
// gulp.task('test:watch', cb => run(cb));

gulp.task('npm:cache:clean', shell.task(['npm cache clean']));


gulp.task('npm:prune', cb => {
  if (process.env.NODE_ENV === 'production') {
    run('npm:prune:dist', cb);
  }
});
gulp.task('npm:prune:dist', shell.task(['npm prune --production --loglevel error']));

gulp.task('jspm:unbundle', shell.task([
  `(git diff --name-only --cached | grep config/systemjs.config.js > /dev/null &&
   (jspm unbundle; git add config/systemjs.config.js)) || true`
]));

// Karma tasks
gulp.task('karma:ci', () => {});

// gulp.task('tdd', function (done) {
//   new karma({
//     configFile: __dirname + '/config/karma.dev.js'
//   }, done).start();
// });

// Utility tasks
const loc = ['#!/bin/sh', 'PATH="/usr/local/bin:$PATH"', 'npm run git:hooks:pre-commit'];
gulp.task('git:hooks:install', shell.task([
  `printf '${loc.join('\n')}' > ./.git/hooks/pre-commit`,
  'chmod +x ./.git/hooks/pre-commit'
]));

gulp.task('typings:install', shell.task(['typings install']));
