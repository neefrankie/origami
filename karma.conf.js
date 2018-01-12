// Karma configuration
// Generated on Fri Jan 12 2018 11:16:53 GMT+0800 (中国标准时间)
const buble = require('rollup-plugin-buble');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');//找到node_modules中的模块
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      {
        pattern:'test/*.test.js',
        watched:false
        // Make sure to disable Karma’s file watcher
        // because the preprocessor will use its own.
      }
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    /*
    preprocessors: {
      'test/*.test.js':['rollup']
    },

    rollupPreprocessor: {
      plugins: [
        babel({//这里需要配置文件.babelrc
          exclude:'node_modules/**'
        }),
        resolve({
          jsnext:true,
        })
      ],
			
			output:{
        format: 'iife', // Helps prevent naming collisions.
        name: 'test', // Required for 'iife' format.
			  sourcemap: 'inline' // Sensible for testing.
      }
    },
    */
    preprocessors: {
      'test-context.js': ['webpack']
    },
    webpack: {
        module: {
            loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: 'babel?presets[]=es2015' }
            ]
        },
        resolve: {
          root: [
            path.join(cwd, 'bower_components'),
            path.join(cwd, 'node_modules')
          ]
        },
        watch: true
    },
    webpackServer: {
        noInfo: true
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
