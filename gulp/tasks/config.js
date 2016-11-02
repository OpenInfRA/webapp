var gulp 	= require('gulp'),

    fs          = require('fs'),
    b2v         = require('buffer-to-vinyl'),
    ngConfig   	= require('gulp-ng-config'),

    dgConfig    = require('../config.js'),
    packjs 	= require('../../package.json') || {};


module.exports = [ [ 'digest' ], function() {
  var config = dgConfig.config;
  var app    = config.app  || {};
 
  app.urlApp  = '.app';
  app.version = packjs.version;
  app.digest  = fs.readFileSync('build/digest', 'utf8');

  var json = JSON.stringify({ oiConfig : app });

  return b2v.stream(new Buffer(json), 'config.js')
    .pipe(ngConfig('oi.config'))
    .pipe(gulp.dest('build'));
}];


