require('es6-promise').polyfill();
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    compass = require('gulp-compass'),
    postcss = require('gulp-postcss'),
    data = require('gulp-data'),
    clean = require('gulp-clean'),
    nunjucksRender = require('gulp-nunjucks-render'),
    autoprefixer = require('autoprefixer');

gulp.task('cleanup', function() {
  gulp.src(['./dist/*', '!./dist/img', '!./dist/img/**'], { read: false })
      .pipe(clean());
});

gulp.task('nunjucks', function() {
  generateTemplates('si');
  generateTemplates('en');

  // 
  function generateTemplates (lang) {
    var dest = lang === 'en' ? 'en/' : '';
    gulp.src([
          './src/templates/'  + lang + '/**',
          '!./src/templates/' + lang + '/includes',
          '!./src/templates/' + lang + '/includes/**'
        ])
        .pipe(data(function (file) {
          return require('./src/data/data-' + lang + '.json')[getDataForFile(file)];
        }))
        .pipe(data(getDataForFile))
        .pipe(nunjucksRender({
          path: ['src/templates/' + lang + ''],
          inheritExtension: true,
        }))
        .pipe(gulp.dest('./dist/' + dest ));
  };
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

gulp.watch('src/data/*', ['nunjucks']);
gulp.watch('src/templates/**/*', ['nunjucks']);
gulp.watch('src/sass/*.scss', ['sass']);

gulp.task('default', ['cleanup', 'nunjucks', 'sass']);


//
function getDataForFile(file) {
  return file.relative.split('.')[0];
}