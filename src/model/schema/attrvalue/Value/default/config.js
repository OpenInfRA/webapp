angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value', {
    dataFactory : 'SchemaAttrValue',
    tempFactory : 'SchemaAttrValue',

    utilFactory : 'SchemaAttrValueSimple',

    dataTemplates : {
      values : '.TPL/data/values.html'
    },

    tempTemplates : {
      view : '.TPL/temp/view.html'
    }
  });
});
