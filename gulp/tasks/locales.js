var gulp 	= require('gulp'),

    fs          = require('fs'),
    Path	= require('path'),
    globby 	= require('globby'),

    es         	= require('event-stream'),
    vinylSource = require('vinyl-source-stream'),
    vinylBuffer = require('vinyl-buffer'),

    dgUtil	= require('../util.js');


/* -------------------------------------------------------------------- */

var _add_locales = function(obj, lines) {
  lines.split(/\n/).forEach(function(line) {
    var keys  = line.replace(/\s*=.*$/, '').replace(/^\s+/, '');
    var trans = line.replace(/^\s*([^=]+)\s*=\s*/, '');

    if (!keys) { return; }

    keys = keys.split('.');
    var key = keys.pop();

    if (!key) { return; }

    keys.forEach(function(seg) {
      obj = obj[seg] || (obj[seg] = {});
    });
 
    obj[key] = trans;
  });
};

var _load_file = function(obj, file) {
  return new Promise(function(resolve, reject) { 
    fs.readFile(file, function(err, data) {
      if (err) {
        reject();
        return;
      }

      _add_locales(obj, data.toString());
      resolve();
    });
  });
};

var _load_locales = function(files) {
  if (!Array.isArray(files)) { return {}; }

  var locales = {}, 
      wait    = [];

  files.forEach(function(file) {
    var absFile = dgUtil.absFile(file);
    var relFile = dgUtil.relFile(file);

    var lang = dgUtil.resolveLang(absFile);
    if (!lang) { return; }

    var path = file.replace(file.base, '').split(Path.sep);
        path.pop();
        path.shift();

    if (path[0] === 'locales') { path.shift(); }

    var base = locales[lang] || (locales[lang] = {});

    path.forEach(function(seg) {
      base = base[seg] || (base[seg] = {});
    });
  
    wait.push(_load_file(base, absFile));
  });

  return Promise.all(wait).then(function() {
    return locales;
  });
};


/* -------------------------------------------------------------------- */

var _build_locales = function(locales) {
  var langs = Object.keys(locales);
  var streams = [];

  langs.forEach(function(l) {
    var stream = vinylSource(l + '.json');
    var streamEnd = stream;

    stream.write(JSON.stringify(locales[l]));

    process.nextTick(function() { stream.end(); });

    streamEnd = streamEnd
      .pipe(vinylBuffer())
      .pipe(gulp.dest('dist/.app/locales'));

    streams.push(streamEnd);
  });

  return es.merge.apply(this, streams);
};


/* -------------------------------------------------------------------- */
/* -- locales --------------------------------------------------------- */
/* -------------------------------------------------------------------- */

module.exports = [ function() {
  return globby(['src/**/locale-*.txt', 'src/locales/*.txt']).then(function(files) {
    return _load_locales(files);

  }).then(function(locales) {
    return _build_locales(locales);
  });
}];
