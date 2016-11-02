angular.module('oi.model').factory('oiModelSchemaAttrValueDataFactory', function ($q, $log, oiModelBaseDataFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseDataFactory,
      SUPER_initData = SUPER.prototype.initData;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelSchemaAttrValueDataFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaAttrValueDataFactory, SUPER);


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  
  proto.initData = function() {
    var vals = this.data.values;
    var util = this.util;
  
    if (vals && util) {
      for (var i = 0; i < vals.length; i++) {
        vals[i] = util.simplifyValue(vals[i]);
      }
    }

    return SUPER_initData.call(this);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaAttrValueDataFactory;
});
