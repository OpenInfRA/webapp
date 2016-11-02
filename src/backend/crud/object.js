angular.module('oi.backend').factory('oiBackendCrudObjectFactory', function ($q, $log, oiBackendApiFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiBackendApiFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiBackendCrudObjectFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiBackendCrudObjectFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.update = function(ds) {
    return this.up.update(this.id, ds);
  };

  proto.destroy = function() {
    return this.up.destroy(this.id);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.read = function() {
    var args = [].slice.call(arguments);
        args.unshift(this.id);

    return this.up.read(args);
  };

  proto.count = function() {
    var args = [].slice.call(arguments);
        args.unshift(this.id);

    if (args.length === 1) { return $q.reject(); }

    return this.up.count(args);
  };

  proto.all = function() {
    var args = [].slice.call(arguments);
        args.unshift(this.id);

    return this.up.all.apply(this.up, args);
  };

  proto.enumerate = function() {
    var args = [].slice.call(arguments);
        args.unshift(this.id);

    return this.up.enumerate.apply(this.up, args);
  };
 

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.clearCache = function() {
    var args = [].slice.call(arguments);
    return this.cache.clear('GET', [ this.path, args ]);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiBackendCrudObjectFactory;
});
