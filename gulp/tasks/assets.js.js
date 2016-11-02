var gulp 	= require('gulp'),
    concat	= require('gulp-concat');

var src  = 'dist/.app/assets',
    dest = 'dist/.app';

module.exports = [ [ 'assets' ], function () {
  return gulp.src([src+'/angular.min.js', 
                   src+'/angular-translate.min.js', 
                   src+'/angular-*.js', 
               '!'+src+'/late', 
               '!'+src+'/iframe', 
                   src+'/*.js'])
    .pipe(concat('assets.js'))
    .pipe(gulp.dest(dest));
}];
