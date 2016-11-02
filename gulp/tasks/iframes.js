var gulp 	= require('gulp');
    tap 	= require('gulp-tap'),
	
    dgUtil	= require('../util.js');

var dest = 'dist/.app/iframes',
    call = dgUtil.expandShortcuts;

module.exports = [ function () {
  return gulp.src(['src/iframes/*.html'])
    .pipe(tap(call))
    .pipe(gulp.dest(dest))
}];
