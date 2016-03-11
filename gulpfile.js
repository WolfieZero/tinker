
var browserSync = require('browser-sync').create();
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');


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


gulp.task('sass', function() {
    return gulp.src('./app/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.stream());
});


gulp.task('serve', function() {
    browserSync.init({
        server: './app'
    });
    gulp.watch('./app/sass/**/*.scss', ['sass']);
    gulp.watch('./app/**/*.html').on('change', browserSync.reload);
});


gulp.task('default', ['serve']);
