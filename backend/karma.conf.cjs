// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        plugins: [
            'karma-spec-reporter',
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-jasmine-html-reporter',
            'karma-typescript'
        ],
        files: [
            { pattern: '**/*[sS]pec.ts', watched: true }
        ],
        basePath: "./src/app/spec",
        frameworks: ['mongoose', 'jasmine', 'karma-typescript'],
        webpack: {
            module: {
                rules: [
                    { test: /spec\.ts/, exclude: /node_modules/, loader: 'babel-loader' }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        },
        tsconfig: './tsconfig.json',

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
          "**/*.ts": ["karma-typescript"]
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'kjhtml', 'spec', "karma-typescript"],
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
    });
};
