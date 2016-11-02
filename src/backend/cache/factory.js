angular.module('oi.backend').factory('oiBackendCacheFactory', function ($q, $log, oiUtilUrl, oiUtilProtoBuildEnumerate) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiBackendCacheFactory = function(args) {
    this.rest = args.rest;

    this.__cache = {};
    this.__load  = {};
  };

  var proto = oiBackendCacheFactory.prototype;

  /* ------------------------------------------------------------------ */

  var _key_url_query = function(pre, args) {
    var query;

    args = oiUtilUrl.flattenArgs(args);

    if (args.length > 1) {
      if (angular.isObject(args[args.length - 1])) {
        query = args.pop();
      }
    }

    var key = pre+':'+args.join(':') + (query ? JSON.stringify(query) : '');
    var url = args.join('/');

    return [ key, url, query ];
  };

  var _load_cached = function(that, key, req) {
    var cache = that.__cache;
    if (key in cache) { return $q.resolve(cache[key]); }

    var load = that.__load;
    if (key in load) { return load[key]; }

    var wait = load[key] = req().then(function(data) {
      cache[key] = data;
      delete(load[key]);

      return data;
    });

    return wait;
  };


  /* ------------------------------------------------------------------ */
  /* .get(seg+, query?);
  /* ------------------------------------------------------------------ */

  var _get = function(that, args) {
    var kuq = _key_url_query('GET', args);
    var key = kuq[0];

    return _load_cached(that, key, function() {
      return that.rest.get(kuq[1], kuq[2]);
    });
  };

  proto.get = function() {
    if (arguments.length === 0) { return $q.reject(); }
    return _get(this, [].slice.call(arguments));
  };


  /* ------------------------------------------------------------------ */
  /* .count(seg+);
  /* ------------------------------------------------------------------ */

  var _count = function(that, args) {
    var kuq = _key_url_query('COUNT', args);
    var key = kuq[0];

    return _load_cached(that, key, function() {
      return that.rest.count(kuq[1], kuq[2]);
    });
  };

  proto.count = function() {
    if (arguments.length === 0) { return $q.reject(); }
    return _count(this, [].slice.call(arguments));
  };


  /* ------------------------------------------------------------------ */
  /* .all(seg+, query?);
  /* .enumerate(seg+, query?, fn(date));
  /* ------------------------------------------------------------------ */

  var _enum_get = function(url, query) { return _get(this, [ url, query ]); };

  proto.all       = oiUtilProtoBuildEnumerate.buildAll({       max : 50, get : _enum_get });
  proto.enumerate = oiUtilProtoBuildEnumerate.buildEnumerate({ max : 50, get : _enum_get });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.clear = function() {
    if (arguments.length === 0) { 
      this.__cache = {};
      this.__load  = {};

    } else {
      var args = [].slice.call(arguments);

      // pre is first argument!
      var kuq = _key_url_query(args.shift(), args);
      var key = kuq[0];

      delete(this.__cache[key]);
      delete(this.__load[key]);
    }
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiBackendCacheFactory;
});
