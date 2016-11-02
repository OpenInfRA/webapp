var gulp 	= require('gulp'),
    changed	= require('gulp-changed'),

    dgConfig 	= require('../config.js');


module.exports = [ [ 'load-assets', 'copy-assets' ], function() {
  var DAPP = dgConfig.DAPP;

  return gulp.src([ 'assets/**/*', 'build/assets/**/*' ])
    .pipe(changed(   DAPP + '/assets' ))
    .pipe(gulp.dest (DAPP + '/assets' ));
}];


