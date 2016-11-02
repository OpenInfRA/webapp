var gulp 	= require('gulp'),
    crypto      = require('crypto'),
    tap 	= require('gulp-tap'),
    sort 	= require('gulp-sort'),
    concat     	= require('gulp-concat');

var call = function(file) {
  var hash = crypto.createHash('md5').update(file.contents).digest('hex');
  file.contents = new Buffer(hash);
};

var dest = 'build';

module.exports = [ function() {
  return gulp.src(['src/**/*.js'])
    .pipe(sort())
    .pipe(concat('digest'))
    .pipe(tap(call))
    .pipe(gulp.dest(dest));
}];
