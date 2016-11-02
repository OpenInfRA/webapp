var gulp 	= require('gulp'),

    jshint     	= require('gulp-jshint'),
    tap 	= require('gulp-tap'),

    addStream  	= require('add-stream'),
    addSrc     	= require('gulp-add-src'),

    concat     	= require('gulp-concat'),
    ngAnnotate 	= require('gulp-ng-annotate'),
    replace    	= require('gulp-replace'),

    wrap       	= require('gulp-wrap'),
    uglify     	= require('gulp-uglify'),
    sourcemaps 	= require('gulp-sourcemaps'),

    size       	= require('gulp-size'),

    dgUtil 	= require('../util.js');

var environments = require('gulp-environments'),
    development  = environments.development, 
    production   = environments.production; 


var mod_vars = {};
var mod_uniq = 1;

function mod_var(name, set) {
  if (set && !mod_vars[name]) {
    mod_vars[name] = 'ANGULAR_MODULE_'+mod_uniq++;
  }

  return mod_vars[name]; 
}

var set_mod_reg = /^angular\.module\('([^']+)',\s*\[/mg;
var set_mod_var = function(match, p1) {
  return 'var '+mod_var(p1, true)+' = '+match;
};

var use_mod_reg = /\bangular\.module\('([^']+)'\)\./mg;
var use_mod_var = function(match, p1) {
  var var_name = mod_var(p1, false);

  return var_name ? var_name+'.' : match;
};

var dest = 'dist/.app';

module.exports = [ [ 'config', 'locales', 'translations', 'templates', 'templateCache' ], function () {
  return gulp.src(['src/main.js', 'src/**/module.js', 'build/templateCache.js', 'src/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(tap(dgUtil.expandShortcuts))
    .pipe(addSrc.append('build/config.js'))
    .pipe(addSrc.append('build/translations.js'))
    .pipe(development(sourcemaps.init()))
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(production(replace(set_mod_reg, set_mod_var)))
      .pipe(production(replace(use_mod_reg, use_mod_var)))
      .pipe(wrap('(function(angular){\n"use strict";\n<%= contents %>\n})(angular);'))
      .pipe(production(uglify()))
    .pipe(development(sourcemaps.write()))
    .pipe(size())
    .pipe(gulp.dest(dest));
}];
