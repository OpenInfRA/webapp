var gulp 	= require('gulp'),
    changed	= require('gulp-changed'),

    conf 	= require('../conf/assets.conf.json'),

    dgUtil      = require('../util.js'),
    dgConfig 	= require('../config.js');

var DAPP = dgConfig.DAPP;


var _npm_src = function(src) {
  return 'node_modules/'+src;
};

var _dist_tgt = function(tgt) {
  return DAPP+'/assets/'+tgt;
};


var _copy_file = function(src, tgt) {
  src = _npm_src(src);
  tgt = _dist_tgt(tgt);

  return dgUtil.sameFile(src, tgt).then(function(same) {
    if (!same) {
      return dgUtil.copyFile(src, tgt);
    }
  });
};

var _copy_dir = function(src, tgt) {
  src = _npm_src(src);
  tgt = _dist_tgt(tgt);

  return new Promise(function(resolve, reject) {
    gulp.src([ src+'/**/*' ])
      .pipe(changed(tgt))
      .pipe(gulp.dest(tgt))
      .on('error', reject)
      .on('end', resolve);
  });
};


var _copy_assets = function() {
  var P, wait = [];

  if (!conf) { return wait; }

  var npm  = conf.npm;
  if (!typeof(npm) === 'object') { return wait; }

  for (var file in npm) {
    if (file.match(/\/$/)) {
      P = _copy_dir(npm[file], file);

    } else {
      P = _copy_file(npm[file], file);
    }
 
    wait.push(P);
  }

  return wait;
};


module.exports = [ function() {
  var wait = _copy_assets();

  return Promise.all(wait);
}];


