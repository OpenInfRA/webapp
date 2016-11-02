angular.module('oi.api').factory('oiApiV1SchemaTopInstUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaTopInstUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaTopInstUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _sort_by_order = function(a, b) { return a.$order - b.$order; };

  proto.dataExtend = function(uuid, data, full) {
    var that = this;

    var values = this.read(uuid, 'topic', { geomType : 'GEOJSON' }).then(function(read) {
      return read.attributeTypeGroupsToValues;

    }).then(function(groups) {
      var atgs = {}; // lookup values via attributeTypeGroup -> attributeType

      angular.forEach(groups, function(group) {
        var ats = atgs[ group.attributeTypeGroup.uuid ] = {};

        angular.forEach(group.attributeTypesToValues, function(value) {
          ats[ value.attributeType.uuid ] = value.attributeValues;
        });
      });
 
      return atgs;
    });

    var topchar = this.shared.schema.util('topiccharacteristics').dataRead(data.topicCharacteristic.uuid, true);

    return $q.all([ values, topchar ]).then(function(all) {
      var values  = all[0];
      var topchar = all[1];

      data.topicCharacteristic = topchar;

      var avgs = [];

      angular.forEach(topchar.attributeGroups, function(ag) {
        var avg = { attributeGroup : ag, $order : ag.order };
        var avs = avg.attributeValues = [];

        avgs.push(avg);

        var vals = values[ag.attributeTypeGroup.uuid];
        if (!vals) { avg.$empty = true; }

        angular.forEach(ag.attributes, function(a) {
          var av = { attribute : a, $order : a.order };
              av.values = vals ? vals[a.attributeType.uuid] : [];

          avs.push(av);
        });

        avs.sort(_sort_by_order);
      });

      avgs.sort(_sort_by_order);

      return that.shared.schema.simplifyList('AttributeValueGroup', avgs);

    }).then(function(list) {
      data.attributeValueGroups = list;

      return data;
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaTopInstUtilFactory;
});
