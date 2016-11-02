var gulp 	= require('gulp');
    tap 	= require('gulp-tap'),
	
    dgUtil	= require('../util.js');

var dest = 'dist/.app/tpl',
    call = dgUtil.expandShortcuts;

module.exports = [ function() {
  return gulp.src(['src/**/*.html', '!src/index.html'])
    .pipe(tap(call))
    .pipe(gulp.dest(dest));
}];
