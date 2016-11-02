angular.module('oi.api').factory('oiApiV1SchemaAttrGroupUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;
      // SUPER_destroy = SUPER.prototype.destroy;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaAttrGroupUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaAttrGroupUtilFactory, SUPER);


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.prepareCreate = function(data, into) {
    into.topicCharacteristicId = this.up.id;

    var aTG = data.attributeTypeGroup;
    if (!aTG) { return; }

    var util = this.shared.schema.util('attributetypegroups');

    return util.create(aTG).then(function(id) {
      return util.read(id).then(function(adata) {
        data.attributeTypeGroup = into.attributeTypeGroup = adata;
      });
    });
  };

  proto.prepareUpdate = function(data) {
    var aTG = data.attributeTypeGroup;
    if (!aTG || !aTG.uuid) { return; }

    // wenn names und descriptions uuids haben, wurde nichts geaendert
    if (aTG.names.uuid && aTG.descriptions.uuid) { return; }

    var util = this.shared.schema.util('attributetypegroups');
    var that = this;

    return util.update(aTG.uuid, aTG).then(function() {
      that.clearCache(data.uuid);
    });
  };


  /* ------------------------------------------------------------------ */

/*
  proto.destroy = function(id) {
    var util = this.shared.schema.util('attributetypegroups');
  
    return SUPER_destroy.call(this, id).then(function() {
      return util.destroy(id);
    });
  };
*/

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataPrimerFull = function(data, full) {
    data.configuration = this.shared.schema.newConfiguration(full);
    data.attributes    = [];

    return data;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaAttrGroupUtilFactory;
});
