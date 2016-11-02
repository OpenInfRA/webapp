angular.module('oi.model').factory('oiModelSchemaAttrValueDataUtilFactory', function ($q, $log, oiModelBaseDataUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseDataUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelSchemaAttrValueDataUtilFactory = function(base) {
    SUPER.call(this, base);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaAttrValueDataUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.simplifyValue = function(value) { return value; };
  proto.apifyValue    = function(value) { return value; };

  proto.validateValue = function() { return true; };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaAttrValueDataUtilFactory;
});
