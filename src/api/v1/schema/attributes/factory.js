angular.module('oi.api').factory('oiApiV1SchemaAttributeUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaAttributeUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaAttributeUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.modelType = function(data) {
    if (!angular.isObject(data)) { return; }

    var aT = data.attributeType;
    if (!aT) { return; }

    switch (aT.type) {
      case 'ATTRIBUTE_VALUE_GEOM'   : return 'Geom';
      case 'ATTRIBUTE_VALUE_GEOMZ'  : return 'GeomZ';
      case 'ATTRIBUTE_VALUE_DOMAIN' : return 'Domain';
    }

    if (aT.type !== 'ATTRIBUTE_VALUE_VALUE') { return; }

    var dT = aT.dataType;
    if (!dT) { return; }

    if ('name' in dT) { return 'Value.'+dT.name; }

    return 'Value.'+dT.names.localizedStrings[0].characterString;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.prepareCreate = function(data) {
    var aT = data.attributeType;
    delete(data.attributeType);

    var util = this.shared.schema.util('attributetypes');

    return util.create(aT).then(function(id) {
      return util.get(id).then(function(adata) {
        data.attributeType = adata;
      });
    });
  };

  proto.prepareUpdate = function(data) {
    var aT = data.attributeType;
    delete(data.attributeType);

    // remove the topic in any case, we update it here 

    if (!aT || !aT.uuid) { return; }

    var util = this.shared.schema.util('attributetypes');
    var that = this;

    return util.update(aT.uuid, aT).then(function() {
      that.clearCache(data.uuid);
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaAttributeUtilFactory;
});
