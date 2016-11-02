var gulp = require('gulp'),
    run  = require('run-sequence').use(gulp);

module.exports = [ function(done) {
  run('clean-dist', 'html', done);
}];
