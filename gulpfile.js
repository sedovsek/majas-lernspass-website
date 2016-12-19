require('es6-promise').polyfill();
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    compass = require('gulp-compass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer');

gulp.watch('src/*.scss', ['default']);

gulp.task('default', function() {
    gulp.src('./src/style.scss')
        .pipe(compass({
            css: 'css',
            sass: 'src'
        }))
        .pipe(postcss([ autoprefixer({ browsers: ['last 12 versions'] }) ]))
        .pipe(gulp.dest('./css'));
});