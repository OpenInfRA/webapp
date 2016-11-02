angular.module('oi.backend').factory('oiBackendApiFactory', function ($log, oiUtilObject) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _path = function(up, args) {
    var path = up.path ? up.path.slice() : [];
    if (args.path) { path.push(args.path); }

    return path;
  };

  var oiBackendApiFactory = function(args) {
    var def = args.def || { DOWN : {} };
    this.definition = def;

    var up = this.up = (args.up || this);
    this.path = _path(up, args);

    var back = this.backend = up.backend || args.backend;

    this.rest  = up.rest  || back.rest;
    this.cache = up.cache || back.cache;
 
    if ('id' in args) { this.id = args.id; }

    this.__api_utils   = {};
    this.__api_objects = {};
  };

  var proto = oiBackendApiFactory.prototype;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // there is no automatic initialisation! .object und .util just create
  // the objects with the necessary arguments; if any of these objects need
  // to be initialized, you must ensure this by other (external) means
  // 
  // this should be used very rarely, and mostly only to speedup later lookups
  // on well defined classes

  proto.init = function() { return; };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _find_default_factory = function(def, key) {
    while (def) {
      if (key in def) { return def[key]; }
      def = def.UP;
    }
  };

  var _def_factory = function(def, key) {
    var name = def.factory || _find_default_factory(def.UP, key);
    if (!name) { 
      $log.error('missing oiBackendApiFactory definition', key);
      return;
    }

    return name;
  };

  proto.util = function(key) {
    if (!key) { return; }

    var util = this.__api_utils[key];
    if (!util) {
      var def = this.definition.DOWN[key];
      if (!def) { 
        $log.log('crud api not defined', key, this.path); 
        return;
      }

      var fac = _def_factory(def, 'utilFactoryDefault');
      if (!fac) { return; }

      util = oiUtilObject.create(fac, { def : def, up : this, backend : this.backend, path : key });
      if (!util) { return; }
 
      this.__api_utils[key] = util;
    }
 
    return util;
  };


  /* ------------------------------------------------------------------ */
  /* <util>.object(id);                                                 */
  /* <object>.object(util, id)                                          */
  /* ------------------------------------------------------------------ */

  proto.object = function(id) {
    var arglen = arguments.length;

    if (arglen === 2) {
      var util = this.util(arguments[0]);
      if (!util) { return; }

      return util.object(arguments[1]);

    } else if (arglen !== 1) { 
      return; 
    }

    var obj = this.__api_objects[id];
    if (!obj) {
      var def = this.definition.DOWN[':id'];
      if (!def) { 
        $log.log('crud api not defined', ':id', this.path); 
        return;
      }

      var fac = _def_factory(def, 'objectFactoryDefault');
      if (!fac) { return; }

      obj = oiUtilObject.create(fac, { def : def, up : this, backend : this.backend, path : id, id : id });
      if (!obj) { return; }
 
      this.__api_objects[id] = obj;
    }
 
    return obj;
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiBackendApiFactory;
});
