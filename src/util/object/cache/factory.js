angular.module('oi.util').factory('oiUtilObjectCacheFactory', function (oiUtilObject) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // fn(args) => abs-factory-name

  var _get_factory = function(args, that) {
    var fac = this.__factory.apply(that, args);
    if (!fac) { return; }

    var fn = oiUtilObject.factory(fac);
    if (!fn) { return; }

    return new fn();
  };

  // fn(args) => [ abs-factory-name, base-object, args-object ]

  var _get_create = function(args, that) {
    var create = this.__create.apply(that, args);
    if (!angular.isArray(create)) { return; }

    return oiUtilObject.create(create[0], create[1], create[2]);
  };

  // fn(args) => [ factory-fn, args-array ]

  var _get_invoke = function(args, that) {
    var invoke = this.__invoke.apply(that, args);
    if (!angular.isArray(invoke)) { return; }

    var fac = invoke.shift();
    return oiUtilObject.invoke(fac, invoke);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiUtilObjectCacheFactory = function(args) {
    if (!angular.isObject(args)) { args = {}; }

    this.__cache = {};

    if (typeof(args.factory) === 'function') {
      this.__factory = args.factory;
      this.__get     = _get_factory;

    } else if (typeof(args.create) === 'function') {
      this.__create = args.create;
      this.__get    = _get_create;

    } else if (typeof(args.invoke) === 'function') {
      this.__invoke = args.invoke;
      this.__get    = _get_invoke;
    }
  };

  var proto = oiUtilObjectCacheFactory.prototype;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.__get = function() { return; }; // just for sure

  proto.get = function(key, args, that) {
    if (!key) { return; }

    var cache = this.__cache;
    if (key in cache) { return cache[key]; }

    if (typeof(that) === 'undefined') { that = null; }
    
    var obj = cache[key] = this.__get(args, that);
    return obj;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.clear = function() { this.__cache = {}; };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiUtilObjectCacheFactory;
});
