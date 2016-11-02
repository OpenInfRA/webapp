var gulp 	= require('gulp'),

    tplCache   	= require('gulp-angular-templatecache');

var root = '.app/tpl';

module.exports = [ [ 'templates' ], function() {
  return gulp.src(['dist/'+root+'/**/*.html'])
    .pipe(tplCache('templateCache.js', { 
      module : 'oi', root : root,
      templateHeader : "angular.module('<%= module %>'<%= standalone %>).run(function($templateCache) { 'use strict';",
      templateBody   : "$templateCache.put('<%= url %>','<%= contents %>');",
      templateFooter : "});"
     }))
    .pipe(gulp.dest('build'));
}];


