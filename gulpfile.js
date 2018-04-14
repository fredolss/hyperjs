var gulp = require('gulp'); 
var Server = require('karma').Server; 
var browserify = require('browserify'); 
var tsify = require('tsify'); 
var source = require('vinyl-source-stream'); 
var tsc = require("typescript"); 
var glob = require("glob"); 
var uglify = require('minify-stream');
var fs = require('fs'); 

/**
 * Bundle the code for testing
 */
gulp.task('bundle-tests', function () {

    var files = glob.sync('./tests/spec/*.spec.ts');
    var b = browserify({ plugin: [tsify], entries:files });

    return b
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("./tests/build")); 
}); 

/**
 * Create a minfied bundle
 */
gulp.task('bundle-min', function () {

    var json = JSON.parse(fs.readFileSync('./package.json')); 
    var files = glob.sync('./src/*.ts');
    var b = browserify({  plugin: [tsify], entries:files, debug:false, standalone:json.name });
 
    return b
        .bundle()
        .pipe(uglify({ sourceMap: false }))
        .pipe(source(json.name +'.min.js'))
        .pipe(gulp.dest("./dist")); 
}); 

/**
 * Create bundle main file
 */
gulp.task('bundle', function () {

    var json = JSON.parse(fs.readFileSync('./package.json')); 
    var files = glob.sync('./src/*.ts');
    var b = browserify({ entries:files, debug:false, standalone:json.name });
 
    return b
        .plugin(tsify, { noImplicitAny: true  })
        .bundle()
        .pipe(source(json.name +'.js'))
        .pipe(gulp.dest("./")); 
}); 

/**
 * Run test once and exit
 */
gulp.task('test', ["bundle-tests"], function(done) {
   new Server( {
        configFile:__dirname + '/tests/karma.conf.js', 
        singleRun:true
    }, done).start(); 
}); 

/**
 * Generate d.ts file
 */
gulp.task('dts',function() {

    var json = JSON.parse(fs.readFileSync('./package.json'));

    require('dts-generator').default({
		name: json.name,
        project: './src',
        main: 'hyperjs/HyperJS',
		out:  json.name + '.d.ts'
    });
});

/**
 * Bundle, create d.ts file and run tests
 */
gulp.task('default', ["bundle","dts","test"], function () {
 
}); 