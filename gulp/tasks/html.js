var gulp 	= require('gulp'),
    tap		= require('gulp-tap'),
   
    dgUtil   	= require('../util.js');

var dest = 'dist',
    call = dgUtil.expandShortcuts;

module.exports = [ [ 'css', 'assets', 'assets.js', 'iframes', 'app' ], function() {
  return gulp.src(['src/index.html', 'src/.htaccess'])
    .pipe(tap(call))
    .pipe(gulp.dest(dest));
}];
