angular.module('oi.api').factory('oiApiV1SchemaObjectFactory', function ($q, $log, oiBackendCrudObjectFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiBackendCrudObjectFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaObjectFactory = function(args) {
    SUPER.call(this, args);

    this.shared    = this.up.shared || {};
    this.dataModel = this.definition.dataModel;
  };
  
  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaObjectFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.metadata = function(json, replace) { 
    var args = [].slice.call(arguments);
        args.unshift(this.id);

    return this.up.metadata.apply(this.up, args);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataRead = function(full) {
    return this.up.dataRead(this.id, full);
  };

  proto.dataUpdate = function(data) {
    return this.up.dataUpdate(this.id, data);
  };

  proto.dataAll = function(query, full) {
    if (typeof(query) === 'boolean') {
      full  = query;
      query = [];
    }

    return this.up.dataAll([ this.id, query ], full);
  };

  proto.dataEnumerate = function(query, fn, full) {
    if (typeof(query) === 'function') {
      full  = fn;
      fn    = query;
      query = [];

    } else if (typeof(fn) !== 'function') { 
      return $q.reject(); 
    }

    return this.up.dataEnumerate([ this.id, query ], fn, full);
  };
 

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataSimplify = function(data) {
    return this.up.dataSimplify(data);
  };

  proto.dataApify = function(data) {
    return this.up.dataApify(data);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaObjectFactory;
});
