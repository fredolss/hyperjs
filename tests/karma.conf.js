﻿// karma.conf.js
module.exports = function (config) {
    config.set({
        files: [
            './build/bundle.js'
        ],
        frameworks: ['jasmine'],
        browsers: ['PhantomJS']
    });
};