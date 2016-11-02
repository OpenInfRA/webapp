var gulp 	= require('gulp'),
    conf 	= require('../conf/assets.conf.json'),

    dgUtil      = require('../util.js');


var _load_asset = function(url, file) {
  return dgUtil.fetchUrl(url).then(function(data) {
    return dgUtil.writeFile(file, data);
  });
};

var _load_assets = function() {
  var wait = [];
  var urls = conf.url;

  if (!urls) { return wait; }

  for (var file in urls) {
    var url = conf.url[file];
       file = 'build/assets/'+file;

    if (!dgUtil.existsFile(file)) {
      wait.push(_load_asset(url, file));
    }
  }

  return wait;
};


module.exports = [ function() {
  var wait = _load_assets();

  return Promise.all(wait);
}];


