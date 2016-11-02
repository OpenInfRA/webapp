angular.module('oi.backend').factory('oiBackendCrudUtilFactory', function ($q, $log, oiBackendApiFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiBackendApiFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiBackendCrudUtilFactory = function(args) {
    SUPER.call(this, args);

    var def = this.definition;
    if ('mergeInto' in def) { this.mergeInto = def.mergeInto; }
  };

  var proto = oiUtilProtoBuild.inherit(oiBackendCrudUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.primer        = function() { return {}; };

  proto.prepareCreate = function(data, into) {};
  proto.prepareUpdate = function(data, into) {};

  proto.mergeInto     = function(data, into) {};


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _merge_into = function(that, data, into, prepare) {
    var wait;

    if (angular.isObject(data)) {
      wait = $q.when( that[prepare](data, into) ).then(function() {
               return that.mergeInto(data, into);
             });

    } else if (typeof(data) === 'function') {
      wait = data.call(that, into);

    } else {
      return $q.reject({ reason : 'expected object or function as data argument' });
    }

    return $q.when(wait).then(function() {
      return into;
    });
  };

  /* ------------------------------------------------------------------ */

  proto.create = function(data) {
    if (!data) { 
      data = {};

    } else if (!angular.isObject(data)) {
      return $q.reject({ reason : 'wrong arguments' });
    }

    var that = this;
    var path = this.path;
    var rest = this.rest;

    return $q.when(this.primer()).then(function(into) {
      return _merge_into(that, data, into, 'prepareCreate');

    }).then(function(into) {
      return rest.post(path, into);

    }).then(function(ds) {
      return ds.uuid;
    });
  };

  // .update(id, { attr+ }); // -> merge({ attr+ }, into);
  // .update(id, function(into) { ... });

  proto.update = function(id, data, base) {
    if (typeof(id) === 'undefined') {
      return $q.reject({ reason : 'wrong arguments' });
    }

    var that = this;
    var rest = this.rest;
    var path = [ this.path, id ];

    if (!angular.isObject(base)) { base = rest.get(path); }

    var from;

    return $q.when(base).then(function(base) {
      from = angular.copy(base);
      return _merge_into(that, data, base, 'prepareUpdate');
 
    }).then(function(into) {
      if (angular.equals(from, into)) { return; }

      return rest.put(path, into).then(function(ds) {
        // FIXME topchars/attrgroups has different id in return, as for path!
        // if (ds.uuid !== id) { return $q.reject({ reason : 'uuid mismatch!', expected : id, got : ds }); }

        that.clearCache(id);

        return true;
      });
    });
  };

  proto.destroy = function(id) {
    if (typeof(id) === 'undefined') {
      return $q.reject({ reason : 'wrong arguments' });
    }
 
    var that = this;
    var rest = this.rest;
    var path = [ this.path, id ];

    return rest['delete'](path).then(function(ds) {
      if (ds.uuid !== id) { return $q.reject(); }
  
      that.clearCache(id);
      that.cache.clear('COUNT', that.path);

      return;
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.read = function() {
    var args = [].slice.call(arguments);

    if (args[0] === false) { 
      args.shift(); 
      return this.rest.get([ this.path, args ]);
    }

    return this.cache.get([ this.path, args ]);
  };

  proto.count = function() {
    var args = [].slice.call(arguments);

    if (args[0] === false) { 
      args.shift(); 
      return this.rest.count([ this.path, args ]);
    }

    return this.cache.count([ this.path, args ]);
  };

  proto.all = function() {
    var args = [].slice.call(arguments);
        args.unshift(this.path);

    return this.cache.all.apply(this.cache, args);
  };

  proto.enumerate = function() {
    var args = [].slice.call(arguments);
        args.unshift(this.path);

    return this.cache.enumerate.apply(this.cache, args);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.clearCache = function() {
    var args = [].slice.call(arguments);
    return this.cache.clear('GET', [ this.path, args ]);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiBackendCrudUtilFactory;
});
