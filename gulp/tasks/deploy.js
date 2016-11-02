var gulp    = require('gulp'),

    fs      = require('fs'),
    symlink = require('gulp-sym'),
    changed = require('gulp-changed'),

    dgUtil   = require('../util.js'),
    dgConfig = require('../config.js');

var environments = require('gulp-environments');

module.exports = [ [ 'dist' ], function() {
  var dest = dgConfig.config.dest || 'html';

  if (environments.development()) {
    return gulp.src('dist')
      .pipe(symlink(dest, { force : true }));
  }

  var absDest  = dgUtil.absFile(dest);
  var statDest = fs.lstatSync(absDest);

  try {
    if (statDest.isSymbolicLink()) {
      fs.unlinkSync(absDest);
    }

  } catch(e) { 
    console.log('removing symlink', e);
  }

  /* replace BASE HREF */
  /* create config */

  return gulp.src([ 'dist/**/*' ], { dot : true })
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
}];
