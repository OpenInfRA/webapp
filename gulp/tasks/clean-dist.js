var gulp	= require('gulp'),
    del		= require('del');

module.exports = [ function() {
  return del([ 'dist' ]);
}];
