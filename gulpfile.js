'use strict';
var gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    includehtml = require('gulp-html-tag-include'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    mainBowerFiles = require('main-bower-files'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    autoprefixer = require('gulp-autoprefixer'),
    w3cjs = require('gulp-w3cjs'),
    through2 = require('through2'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    debug = require('gulp-debug'),
    size = require('gulp-size'),
    fileList = require('gulp-file-list-saver'),
    notify = require('gulp-notify'),
    gutil = require('gulp-util'),
    cached = require('gulp-cached'),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload,
    supportedBrowser = ['last 2 versions', 'ie 10', 'ie 11', 'android 2.3', 'android 4', 'opera 12'];
 
//This helps you with concatination Sass files in order
var sass_files = [
    'bower_components/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss',
    'bower_components/bootstrap-sass-datapicker/assets/sass/datepicker.scss',
    'cwd/assets/sass/all.scss'
    ];
//This is used for HTML Lint
var html_files = ['render/templates/**/*.html'];

//This is used to Move fonts into the correct folder
var fonts = ['bower_components/bootstrap-sass-official/assets/fonts/**/*', 'cwd/assets/fonts/*'];
var onError = function(err) {
    gutil.beep();
    console.log(err);
};

/*======================================
=            HTML - includes          =
======================================*/

gulp.task('include', function() {
    gulp.src(['cwd/templates/**/*.html']).pipe(plumber()).pipe(includehtml({basePath: 'cwd/includes'})).pipe(gulp.dest('./render/templates/')).pipe(reload({
        stream: true
    }));
   
});


/*=============================================
=         Template File Listing  WIP          =
=============================================*/
gulp.task('create-index', function() {
return gulp
 .src('render/templates/**/*.html')
 .pipe(fileList('', 'render/template-list.json'))
});


/*======================================
=            Convert JS         =
======================================*/
var all_js = mainBowerFiles();
//This removes all CSS from mainBowerFiles - to add css use the array at the top of the doc
for (var i = all_js.length - 1; i >= 0; i--) {
     if ( all_js[i].indexOf('.scss') > 0 ||  all_js[i].indexOf('.sass') > 0 ||  all_js[i].indexOf('.css') > 0 ) { 
    all_js.splice(i, 1); } 
};
//Concat JS into one file
all_js.push('cwd/assets/js/main.js');
gulp.task('js', function() {
    return gulp.src(all_js).pipe(concat('main.js', {
        newLine: ' '
    })).pipe(debug({
        title: 'js:'
    })).pipe(gulp.dest('render/assets/js/')).pipe(reload({
        stream: true
    }));
});
/*===========================================
=            Convert sass Render            =
===========================================*/
gulp.task('sass', function() {
    return gulp.src(sass_files).pipe(concat('skin.css')).pipe(sass({
        includePaths: ['cwd/assets/sass/', 'bower_components/bootstrap-sass-official/assets/stylesheets/'],
    })).pipe(autoprefixer({
        browsers: supportedBrowser,
        cascade: false
    })).pipe(plumber()).pipe(gulp.dest('render/')).pipe(reload({
        stream: true
    }))
});
/*========================================
=            Render Minifying            =
========================================*/
gulp.task('minify-js', function() {
    return gulp.src('render/assets/js/main.js').pipe(uglify()).pipe(debug({
        title: 'minify-js:'
    })).pipe(gulp.dest('render/assets/js/'))
});
gulp.task('minify-css', function() {
    return gulp.src('render/skin.css').pipe(minifyCSS({
        keepBreaks: false
    })).pipe(gulp.dest('render/'));
});
gulp.task('imagemin', function() {
    return gulp.src('cwd/assets/images/*').pipe(cache(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))).pipe(gulp.dest('render/assets/images/')).pipe(size({
        showFiles: true
    }));
});
/*============================================
=            Production Minifying            =
============================================*/
gulp.task('production-minify-js', function() {
    return gulp.src('production/assets/js/main.js').pipe(uglify()).pipe(debug({
        title: 'minify-js:'
    })).pipe(gulp.dest('production/assets/js/'))
});
gulp.task('production-minify-css', function() {
    return gulp.src('production/skin.css').pipe(minifyCSS({
        keepBreaks: false
    })).pipe(gulp.dest('production/'));
});
gulp.task('production-imagemin', function() {
    return gulp.src('cwd/assets/images/*').pipe(cache(imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))).pipe(gulp.dest('production/assets/images/')).pipe(size({
        showFiles: true
    }));
});
/*=====================================
=        Testing Tasks  w3c ,js       =
=====================================*/
gulp.task('html-lint', function () {
    gulp.src('render/**/**/*.html')
        .pipe(w3cjs())
        .pipe(through2.obj(function(file, enc, cb){
            cb(null, file);
            if (!file.w3cjs.success){
                throw new Error('HTML validation error(s) found');
            }
        }));
});
/*======================================
=      Accesiblily Role - WIP          =
======================================*/
//Optional
gulp.task('aria', function() {
    gulp.src('render/**/**/*.html').pipe(arialinter({
        level: 'AA'
    })).pipe(gulp.dest('render/'));
});
/*===============================
=        Watcher General        =
===============================*/
gulp.task('watcher', ['include', 'sass', 'js', 'imagemin', 'fonts'], function() {
    browserSync({
        server: "./render/",
        index: "/templates/layouts/index.html"
    });
    gulp.watch("cwd/assets/sass/*.scss", ['sass']).on('error', gutil.log);
    gulp.watch("cwd/**/**/*.html", ['include']);
    gulp.watch("cwd/assets/images/*", ['imagemin']);
    gulp.watch("cwd/assets/js/*.js", ['js']);
    //gulp.watch("render/templates/**/*.html",['html-lint']);
});
/*===============================
=           Move Folders         =
===============================*/
gulp.task('fonts', function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src(fonts)
  .pipe(gulp.dest('render/fonts')); 

});

/*======================================
=            Cleaner Calls             =
======================================*/
gulp.task('clear', function(done) {
    return cache.clearAll(done);
});
gulp.task('clean', function(cb) {
    del(['./render/*'], cb);
});
/*=====================================
=            Task Runners             =
=====================================*/
gulp.task('default', ['include', 'sass', 'js', 'imagemin', 'fonts']);
gulp.task('watch', ['watcher']);
//NEEDS TIDYING
//gulp.task('prod', ['include-production', 'production-js', 'production-imagemin', 'production-minify-js', 'less-production', 'production-minify-css', 'production-fonts']);