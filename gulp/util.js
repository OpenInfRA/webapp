var fs   	= require('fs'),
    Path 	= require('path'),
    mkdirp	= require('mkdirp'),
    filecompare = require('filecompare'),

    fetchUrl    = require("fetch").fetchUrl,

    dgConfig = require('./config.js');

var base = Path.dirname(__dirname);


/* -------------------------------------------------------------------- */
/* -------------------------------------------------------------------- */

exports.expandShortcuts = function(file) {
  var path = file.path.replace(file.base, '').split(Path.sep);
      path.pop();

  var spath = path.join('/');
  var dpath = path.join('.');

  var RAPP = dgConfig.RAPP,
      RTPL = dgConfig.RTPL,
      BASE = dgConfig.BASE,

      CORE = dgConfig.CORE;

  var rapp = spath ? RAPP + Path.sep + spath : RAPP;
  var rtpl = spath ? RTPL + Path.sep + spath : RTPL;

  var cont = file.contents.toString();

  cont = cont.replace(/angular\.module\('oi.'/g, "angular.module('oi."+dpath+"'"); // js
  cont = cont.replace(/translate="\./g, 'translate="'+dpath+'.'); // tpl

  cont = cont.replace(/\.APP\//g, rapp+'/'); 
  cont = cont.replace(/\/APP\//g, RAPP+'/'); 

  cont = cont.replace(/\.TPL\//g, rtpl+'/'); 
  cont = cont.replace(/\/TPL\//g, RTPL+'/'); 

  cont = cont.replace(/<%= DOT %>/g, dpath);
  cont = cont.replace(/<%= BASE_HREF %>/g, BASE);
  cont = cont.replace(/<%= CORE_HREF %>/g, CORE);

  file.contents = new Buffer(cont);
};


/* -------------------------------------------------------------------- */
/* -------------------------------------------------------------------- */
 
var _abs_file = function(file) { return Path.resolve(base, file); };
var _rel_file = function(file) { return file.replace(base, ''); };

exports.absFile = _abs_file;
exports.relFile = _rel_file;

var _exists_file = function(file) {
  try {
    return fs.statSync(file).isFile();

  } catch (e) {
    if (e.code !== 'ENOENT') { throw e; }
    return false;
  }
};


exports.existsFile = function(file) { // !sync
  if (!file) { return false; }

  file = _abs_file(file);

  return _exists_file(file);
};


exports.sameFile = function(file1, file2) {
  file1 = _abs_file(file1);
  file2 = _abs_file(file2);

  return new Promise(function(resolve, reject) {
    if (!(_exists_file(file1) && _exists_file(file2))) {
      resolve(false);
      return;
    }

    filecompare(file1, file2, function(equal) {
      resolve(equal);
    });
  });
};


var _ensure_file_path = function(file) {
  var path = Path.dirname(file);

  return new Promise(function(resolve, reject) {
    mkdirp(path, function(err) {
      if (err) { 
        reject(err); 
        return;
      }

      resolve();
    });
  });
};

exports.ensureFilePath = function(file) {
  file = _abs_file(file);

  return _ensure_file_path(file);
};


var _write_file = function(file, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(file, data, function(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

exports.writeFile = function(file, data) {
  file = _abs_file(file);

  return _ensure_file_path(file).then(function() {
    return _write_file(file, data);
  });
};


var _copy_file = function(src, tgt) {
  return new Promise(function(resolve, reject) {
    var rd = fs.createReadStream(src);
        rd.on('error', reject);

    var wr = fs.createWriteStream(tgt);
        wr.on('error',  reject);
        wr.on('finish', resolve);
      
    rd.pipe(wr);
  });
};

exports.copyFile = function(src, tgt) {
  src = _abs_file(src);
  tgt = _abs_file(tgt);

  return _ensure_file_path(tgt).then(function() {
    return _copy_file(src, tgt);
  });
};


/* -------------------------------------------------------------------- */
/* -------------------------------------------------------------------- */

exports.resolveLang = function(filename) {
  var path = filename.path ? filename.path : filename;
  var name = path.split(Path.sep).pop();

  var lang = name.match(/^(locale-)?([a-z]{2}[_|-]?(?:[A-Z]{2})?)\.(json|txt)$/i);
      lang.pop();

  return lang.pop();
};


/* -------------------------------------------------------------------- */
/* -------------------------------------------------------------------- */

exports.fetchUrl = function(url) {
  return new Promise(function(resolve, reject) {
    fetchUrl(url, function(error, meta, body) {
      if (error) {
        reject(error);
        return;
      };

      resolve(body);
    });
  });
};


