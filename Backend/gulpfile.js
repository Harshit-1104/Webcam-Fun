'use strict';

const gulp = require('gulp'),       
      sass = require('gulp-sass'),        // for the sass conversion
      browserSync = require('browser-sync'),    // syncing it to the browser
      del = require('del'),       // deleting the existing dist files
      imagemin = require('gulp-imagemin'),      // minification of images
      usemin = require('gulp-usemin'),      // to bring it together
      rev = require('gulp-rev'),        // to form the 20 character special hash
      cleanCss = require('gulp-clean-css'),       //
      flatmap = require('gulp-flatmap'),          // to simultaneously perform operation on many files
      htmlmin = require('gulp-htmlmin'),        // for html minification
      terser = require('gulp-terser'),      // gulp-terser is better for uglifying js as it includes es6 too.
      nodemon = require('gulp-nodemon'),
      livereload = require('gulp-livereload');

//const { notify } = require('browser-sync');
//const { proxy } = require('jquery');

function scss() {
  return gulp.src('./public/css/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./public/css'));
}

function sass_watch() {
  gulp.watch('./public/css/*.scss', scss);
};

function browser_sync() {
  var files = [
    './public/*.html',
    './public/css/*.css',
    './public/js/*.js',
    './public/img/*.{png,jpg,gif}',
    './public/svgs/*.svg',
    './public/audio/*.mp3'
  ];

  browserSync.init(files, {
    proxy: "http://localhost:3000",
    port: 4000
  });
};

function server() {
  var stream = nodemon({
    script: './bin/www',
    watch: ["public/*", "public/*/**"],
    ext: 'html json js css'
  });
  
  stream.on('restart', () => {
    console.log('Restarting');
    livereload({start: true});
  });
};

function clean() {
  return del(['dist']);
}

function copyfonts() {
  return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf, woff, eof, svg}*')
  .pipe(gulp.dest('./dist/fonts'));
};

function imageMin() {
  return gulp.src('public/img/*.{png,jpg,gif}')
  .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
  .pipe(gulp.dest('dist/img'));
};

function es() {
  return gulp.src('./public/js/*.js')
    .pipe(terser())
}

function useMin() {
  return gulp.src('./public/*.html')
  .pipe(flatmap(function(stream, file) {
    return stream
    .pipe(usemin({
      css: [rev()],
      html: [function() {return htmlmin({ collapseWhitespace: true})}],
      js: [es(), rev()],
      inlinejs: [es()],
      inlinecss: [cleanCss(), 'concat']
    }))                                       
  }))
  .pipe(gulp.dest('dist/'));
};

exports.default = gulp.parallel(server, browser_sync, sass_watch);
exports.build = gulp.series(clean, gulp.series(copyfonts, imageMin, useMin));