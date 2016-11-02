angular.module('oi.backend').provider('oiBackendApi', function () {
  'use strict';

  var DEF = {};
  var INF = {};

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _get_def = function(api, path) {
    var len = path.length;
    if (!len) { return api; }

    for (var i = 0; i < len; i++) {
      var seg = path[i];
          api = api.DOWN[seg] || (api.DOWN[seg] = { DOWN : {}, UP : api });
    }

    return api;
  };

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _run_def_compiles = function(def, conf, fn) {
    if (typeof(conf[fn]) === 'function') {
      def[fn] = conf[fn];
    }

    var fns = [];
    var ref = def;

    while (ref) {
      if (ref[fn]) { fns.unshift(ref[fn]); }
      ref = ref.UP;
    }

    var flen = fns.length;
    if (flen === 0) { return; }

    for (var i = 0; i < flen; i++) {
      fns[i].call(null, def, conf);
    }
  };

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _define_util = function(api, path, def) {
    var util = _get_def(api, path);
        util.isUtil = true;

    var fac = def.utilFactory || def.factory;
    if (typeof(fac) === 'string') { util.factory = fac; }

    if (typeof(def.utilFactoryDefault)   === 'string') { api.utilFactoryDefault   = def.utilFactoryDefault; }
    if (typeof(def.objectFactoryDefault) === 'string') { api.objectFactoryDefault = def.objectFactoryDefault; }

    _run_def_compiles(util, def, 'compileUtilDefinition');

    return util;
  };

  var _define_object = function(api, path, def) {
    var obj = _get_def(api, path);

    var fac = def.objectFactory || def.factory;
    delete(def.factory);

    path.pop();
    var util = _define_util(api, path, def);

    obj.util     = util;
    obj.isObject = true;

    if (typeof(fac) === 'string') { obj.factory = fac; }

    _run_def_compiles(obj, def, 'compileObjectDefinition');

    return obj;
  };

  var _define_api = function(API, key, def) {
    var path = key.split('/');
    var last = path[path.length-1];
    var api;

    if (last === ':id') {
      api = _define_object(API, path, def);

    } else {
      api = _define_util(API, path, def);
    }

    return api;
  };

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _prepare_api = function(oiUtilInfix) {
    var RegEx = /\$/;

    for (var key in DEF) {
      if (RegEx.test(key)) {
        var def = DEF[key];
        delete(DEF[key]);

        var keys = oiUtilInfix.replaceInfixes(key, INF, '/');
        var plen = keys.length;
 
        for (var i = 0; i < plen; i++) {
          var nkey = keys[i];
          if (!(nkey in DEF)) { DEF[nkey] = angular.extend({}, def); }
        }
      }
    }
   
    return Object.keys(DEF);
  };


  var _compile_api = function(oiUtilInfix) {
    var api = { 
      utilFactoryDefault   : 'oiBackendApiFactory', 
      objectFactoryDefault : 'oiBackendApiFactory',
      DOWN : {}
    };

    var keys = _prepare_api(oiUtilInfix);
    var klen = keys.length;

    if (!klen) { return api; }

    keys.sort();

    for (var i = 0; i < klen; i++) {
      var key = keys[i];
      var def = DEF[key];

      _define_api(api, key, def);
    }
    
    return api;
  };

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  return {
    // -- returned during config phase --------------------------------
  
    // .infix(KEY, path); .infix(KEY, [ path1, path2, ... ]);
    infix : function(key, path) {
      if (typeof(key) !== 'string') { return; }

      if (typeof(path) === 'string') {
        INF[key] = [ path ];

      } else if (angular.isArray(path)) {
        INF[key] = path;
      }
    },

    // .api('path', { opts });
    api : function(path, def) {
      if (typeof(path) !== 'string') { return; }
      if (!angular.isObject(def)) { return; }

      // in der config-phase sammeln wir erstmal nur defs ein.  
      DEF[path] = angular.extend({}, def);
    },


    // -- returned as Service -----------------------------------------

    $get : function($log, oiBackendApiFactory, oiUtilInfix) {
      var api = _compile_api(oiUtilInfix);

      return {
        api : function() { return api; },

        create : function(args) {
          if (!angular.isObject(args)) { args = {}; }
          args.def = api;
 
          return new oiBackendApiFactory(args);
        }
      };
    }
  };
});
