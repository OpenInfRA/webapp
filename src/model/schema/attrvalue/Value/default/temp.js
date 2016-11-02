angular.module('oi.model').factory('oiModelSchemaAttrValueDataTempFactory', function ($q, $log, oiModelBaseDataTempFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseDataTempFactory,
      SUPER_initData = SUPER.prototype.initData;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelSchemaAttrValueDataTempFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaAttrValueDataTempFactory, SUPER);


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

  return oiModelSchemaAttrValueDataTempFactory;
});
