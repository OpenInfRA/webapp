angular.module('oi.model').factory('oiModelSchemaTopInstUtilFactory', function ($q, $log, oiModelBaseUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseUtilFactory;

  var oiModelSchemaTopInstUtilFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaTopInstUtilFactory, SUPER);


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.findValue = function(inst, uuid) {
    var vals = inst.values;
    if (!angular.isArray(vals) && vals.length) { return; }

    for (var i = 0; i < vals.length; i++) {
      var val = vals[i];
      if (val.attributeTypeId === uuid) {
        return val.attributeValueValue.value.localizedStrings[0].characterString;
      }
    }

    return;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaTopInstUtilFactory;
});
