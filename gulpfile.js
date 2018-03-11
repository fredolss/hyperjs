var gulp = require('gulp'); 
var Server = require('karma').Server; 
var browserify = require('browserify'); 
var tsify = require('tsify'); 
var source = require('vinyl-source-stream'); 
var tsc = require("typescript"); 
var glob = require("glob"); 

gulp.task('bundle-tests', function () {

    var files = glob.sync('./tests/spec/*.spec.ts');
    var b = browserify({ plugin: [tsify], entries:files });

    return b
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("./tests/build")); 
}); 

gulp.task('bundle', function () {
    var fs = require('fs'); 
    var json = JSON.parse(fs.readFileSync('./package.json')); 
    var files = glob.sync('./src/*.ts');
    var b = browserify({  plugin: [tsify], entries:files, debug:false, standalone:json.name });
    var uglify = require('minify-stream');
    
    return b
        .bundle()
        .pipe(uglify())
        .pipe(source(json.name +'.min.js'))
        .pipe(gulp.dest("./dist")); 
}); 

gulp.task('test', ["bundle-tests"], function(done) {
   new Server( {
        configFile:__dirname + '/tests/karma.conf.js', 
        singleRun:true
    }, done).start(); 
}); 

/**
 * Run test once and exit
 */
gulp.task('default', ["bundle", "test"], function () {
 
}); 