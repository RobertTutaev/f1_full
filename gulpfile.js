var gulp = require('gulp');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-csso');

//server
gulp.task('start', function() {
  gulp.src('app')
    .pipe(server({
      livereload: true,
      open: true
    }));
});

//styles 
gulp.task('css', function () {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 10 versions'],
    }))
    .pipe(gulp.dest('app/css'));
});

//copy js, css, html
gulp.task('build0', function () {
    return gulp.src('app/*.html', { base: 'app' })
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('public'));
});

//copy image, ico
gulp.task('build1', function () {
    return gulp.src(['app/img/racing-pack/Spritesheets/**/*', 'app/favicon.ico'], { base: 'app' })
        .pipe(gulp.dest('public'));
});

//build
gulp.task('build', ['build0', 'build1']);

//watch
gulp.task('watch', function () {
  gulp.watch('app/sass/**/*.sass', ['css'])
});

//all dev tasks
gulp.task('default', ['start', 'watch']);