var gulp 	= require('gulp'),

    concat	= require('gulp-concat'),
    minifycss  	= require('gulp-minify-css'),
	
    dgUtil	= require('../util.js');

var dest = 'dist/.app';

module.exports = [ function() {
  return gulp.src(['src/css/colors.css', 'src/css/app.css', 'src/css/main.css', 'src/css/**/*.css', 'src/**/*.css'])
    .pipe(concat('app.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(dest));
}];
