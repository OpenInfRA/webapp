var gulp 	= require('gulp'),

    es         	= require('event-stream'),
    util       	= require('gulp-util'),
    concat     	= require('gulp-concat');

    dgUtil	= require('../util.js');

function _cache_translations() {
  return es.map(function(file, callback) {
    file.contents = new Buffer(util.template("$translateProvider.translations('<%= language %>', <%= contents %>);", {
      contents: file.contents,
      file: file,
      language: dgUtil.resolveLang(file)
    }));

    callback(null, file);
  });
}

function _wrap_translations() {
  return es.map(function(file, callback) {
    file.contents = new Buffer(util.template("angular.module('oi').config(function($translateProvider) {\n'use strict';\n<%= contents %>\n});\n", {
      contents: file.contents, file: file
    }));

    callback(null, file);
  });
}

module.exports = [ [ 'locales' ], function() {
  return gulp.src(['dist/.app/locales/en.json', 'dist/.app/locales/de.json'])
    .pipe(es.pipeline(
      _cache_translations(),
      concat('translations.js'),
      _wrap_translations()
    ))
    .pipe(gulp.dest('build'));
}];


