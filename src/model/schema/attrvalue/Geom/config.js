angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Geom', {
    dataTemplates : {
      values : {
        templateUrl : '.TPL/data/values.html',
        controller  : 'oiModelSchemaAttrValueGeomCtrl'
      }
    }
  });
});
