// =============================================================================
// Gulpfile
// =============================================================================


var assign      = require('lodash.assign');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();
var buffer      = require('vinyl-buffer');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var source      = require('vinyl-source-stream');
var sourcemaps  = require('gulp-sourcemaps');
var watchify    = require('watchify');

var watching = false;
var opts = assign({}, watchify.args, {
    entries: ['./app/js/app.js'],
    debug: true
});
var ify  = browserify(opts);


// Browser Sync
// =============================================================================

gulp.task('browser-sync', function() {
    browserSync.init({
        files: './app/*',
        notify: false,
        open: false,
        server: {
            baseDir: './app'
        }
    });
});


// Sass
// =============================================================================

gulp.task('sass', function() {
    return gulp.src('./app/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.stream());
});


// Browserify
// =============================================================================

gulp.task('browserify', bundle);

if (watching) {
    ify = watchify(ify());
}

ify.on('update', bundle); // on any dep update, runs the bundler
ify.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return ify.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/js/'))
        .pipe(browserSync.stream());
}


// Serve
// =============================================================================

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: './app'
    });
    gulp.watch('./app/sass/**/*.scss', ['sass']);
    gulp.watch('./app/js/**/*.js', ['browserify']);
    gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});


// Serve
// =============================================================================

gulp.task('build', ['sass', 'browserify']);


// Default
// =============================================================================

gulp.task('default', ['serve']);
