'use strict';

var gulp   = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var del = require('del');
var webserver = require('gulp-webserver');

/*
 * Path Storage
 */
var paths = {
    js:   './app/js/',
    html: './app/html/',
    scss: './app/scss/',
    img: './app/img/',
    dist: './dist/'
};

/*
 * Gulp Logs
 * @param: String, Boolean 
 */
function gulpLog(log, error) {
    if(error){
        gutil.log(gutil.colors.red('Error: ' + log));
    }else {
        gutil.log(gutil.colors.green(log));
    }
}

function setWatcherListener(watcher) {
    watcher.on('change', function(event) {
        gulpLog(event.type + ': ' + event.path);
    });
}

/*
 * Browserify
 * @param: Boolean 
 * infos: Returns a Browserify or Watchify instance
 */
function buildScript(watch) {

    // ErrorHandler
    function errorHandler(error) {
        gulpLog(error, true);
    }

    // Bundle
    function createBundle(instance) {
        return instance.bundle()
        .on('error', errorHandler)
        .pipe(source('app.js'))
        .on('error', errorHandler)
        .pipe(gulp.dest(paths.dist + 'js/'));
    }

    // Browserify options setup
    var props = {
        entries: paths.js + 'main.js',
        debug: true
    };
   
    if(watch){
        props.cache = {};
        props.packageCache = {};
    }

    // Browerify and Watchify Instances
    var browserifyInstance = browserify(props);
    var watchifyInstance = null;
    if(watch){
        watchifyInstance = watchify( browserifyInstance );
        watchifyInstance.on('update', function(ids) {
            createBundle(watchifyInstance);
            gulpLog('Updated: ' + ids);
        });
    }

    return createBundle(browserifyInstance);
}

/*
 * Gulp Tasks
 */
gulp.task('clean', function() {
    del(paths.dist);
});

gulp.task('copyHTML', function() {
    gulp.src(paths.html + '**/*.html').pipe(gulp.dest(paths.dist + 'html/'));
});

gulp.task('copyIMG', function() {
    gulp.src(paths.img + '**/*').pipe(gulp.dest(paths.dist + 'img/'));
});

gulp.task('scss', function () {
    gulp.src(paths.scss + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('serve', function(){
    gulp.src(paths.dist)
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      open: true
    }));
});

gulp.task('browserify', function(){
    buildScript(false);
});

gulp.task('watchify', function(){
    buildScript(true);
});

gulp.task('html:watch', function() {
    var watcher = gulp.watch(paths.html + '**/*.html', ['copyHTML']);
    setWatcherListener(watcher);
});

gulp.task('scss:watch', function () {
    var watcher =  gulp.watch(paths.scss + '/**/*.scss', ['scss']);
    setWatcherListener(watcher);
});

gulp.task('default', ['clean', 'scss', 'browserify', 'copyHTML', 'copyIMG', 'html:watch', 'scss:watch', 'watchify', 'serve']);
