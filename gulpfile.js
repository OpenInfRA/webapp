require('gulp-load-tasks')('gulp/tasks');

var gulp       	= require('gulp'),
    envs 	= require('gulp-environments'),

    dgConfig  	= require('./gulp/config.js'),

/* -------------------------------------------------------------------- */
/* -------------------------------------------------------------------- */

  development  = envs.development, 
  production   = envs.production; 

  switch(dgConfig.config.environment) {
    case 'development' : envs.current(development); break;
    default            : envs.current(production);
  }

  gulp.task('set-development', development.task);
  gulp.task('set-production',  production.task);


/* -------------------------------------------------------------------- */
/* -------------------------------------------------------------------- */

  gulp.task('default', [ 'dist' ]);
