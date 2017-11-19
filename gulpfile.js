// TODO, issues:
// 1. dist/clean deletes everything, inclujding sub-folders
// 2. nunjucksRender option ext: '' is fine, but we need index.html

require('es6-promise').polyfill();
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    compass = require('gulp-compass'),
    postcss = require('gulp-postcss'),
    data = require('gulp-data'),
    clean = require('gulp-clean'),
    nunjucksRender = require('gulp-nunjucks-render'),
    autoprefixer = require('autoprefixer');

function getDataForFile(file) {
  return file.relative.split('.')[0];
}

gulp.task('cleanup', function() {
  // gulp.src('./dist/*.html', { read: false })
  //     .pipe(clean());

  gulp.src('./dist/css/*.css', { read: false })
      .pipe(clean());
});

gulp.task('nunjucks', function() {
  gulp.src('./src/templates/*.nunjucks')
      .pipe(data(function (file) {
        return require('./src/data/data.json')[getDataForFile(file)];
      }))
      .pipe(data(getDataForFile))
      .pipe(nunjucksRender({
        path: ['src/templates'],
        ext: '',
      }))
      .pipe(gulp.dest('./dist'))
});

gulp.task('sass', function() {
    gulp.src('./src/sass/style.scss')
        .pipe(compass({
            css: 'dist/css',
            sass: 'src/sass'
        }))
        .pipe(postcss([ autoprefixer({ browsers: ['last 5 versions'] }) ]))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.watch('src/templates/**/*', ['nunjucks']);
gulp.watch('src/sass/*.scss', ['sass']);

gulp.task('default', ['cleanup', 'nunjucks', 'sass']);
