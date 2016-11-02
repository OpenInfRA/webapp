angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/topiccharacteristics/:id/attributetypegroups/:id', {
    utilFactory : 'oiApiV1SchemaAttrGroupUtilFactory',
    dataModel   : 'AttributeGroup',
    primer      : 'attributetypegrouptotopiccharacteristic',
    mergeInto   : [ 'order', 'multiplicity' ]
  });
});
