// =============================================================================
// Gulpfile
// =============================================================================


var assign      = require('lodash.assign');
var browserify  = require('browserify');
var browserSync = require('browser-sync');
var buffer      = require('vinyl-buffer');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var source      = require('vinyl-source-stream');
var sourcemaps  = require('gulp-sourcemaps');
var watchify    = require('watchify');
var watching    = false;
var onError     = function(err) {
    gutil.log(gutil.colors.green(err.message));
    this.emit('end');
};


// Browser Sync
// =============================================================================

gulp.task('browser-sync', function() {
    browserSync({
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
        .pipe(sass())
            .on('error', onError)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.stream());
});


// Browserify
// =============================================================================

var ify = browserify(assign({}, watchify.args, {
    entries: './app/js/app.js',
    debug: true
}));

if (watching) {
    ify = watchify(ify());
}

gulp.task('browserify',
    function() {
        return ify.bundle()
            .on('error', onError)
            .pipe(source('bundled.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./app/js'))
            .pipe(browserSync.stream());
    }
);

// Watch
// =============================================================================

gulp.task('watch', function() {
    watching = true;
    gulp.watch('./app/sass/**/*.scss', ['sass']);
    gulp.watch('./app/js/**/*.js', ['browserify']);
    gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});


// Serve
// =============================================================================

gulp.task('serve', ['build', 'browser-sync', 'watch']);


// Serve
// =============================================================================

gulp.task('build', ['sass', 'browserify']);


// Default
// =============================================================================

gulp.task('default', ['serve']);
