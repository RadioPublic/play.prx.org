// Karma configuration
// Generated on Tue Mar 22 2016 02:24:21 GMT-0400 (EDT)

module.exports = (config) => {
  'use strict';

  config.set({
    autoWatch: true,
    basePath: '..',
    browsers: ['Chrome'],
    colors: true,
    concurrency: Infinity,
    logLevel: config.LOG_INFO,
    port: 9876,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'jasmine'],

    jspm: {
      loadFiles: process.env['TESTONLY'] ?
        ['**/' + process.env['TESTONLY'] + '.spec.ts'] :
        ['src/app/**/*.spec.ts'],
      serveFiles: [
        'src/app/**/*!(*.spec).ts',
        'src/app/**/*.css',
        'config/**/*.ts',
        'tsconfig.json'
      ]
    },

    proxies: {
      '/app/': '/base/app/',
      '/assets/': '/base/assets/',
      '/config/': '/base/config/',
      '/util/': '/base/util/',
      '/jspm_packages/': '/base/jspm_packages/',
      '/tsconfig.json': '/base/tsconfig.json'
    },

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'src/app/stylesheets/**/*.*', watched: false, included: false, served: true}
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

    // Source files that you wanna generate coverage for.
    // Do not include tests or libraries (these files will be instrumented by Istanbul)
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],
  })
}
