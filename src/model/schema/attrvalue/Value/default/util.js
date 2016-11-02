angular.module('oi.model').factory('oiModelSchemaAttrValueSimpleDataUtilFactory', function ($q, $log, oiModelSchemaAttrValueDataUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelSchemaAttrValueDataUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelSchemaAttrValueSimpleDataUtilFactory = function(base) {
    SUPER.call(this, base);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaAttrValueSimpleDataUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.simplifyValue = function(value) { return value.xx; };
  proto.apifyValue    = function(value) { return { 'xx' : value }; };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaAttrValueSimpleDataUtilFactory;
});
