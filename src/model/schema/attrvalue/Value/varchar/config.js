angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value.varchar', {
    dataFactory : '',
    utilFactory : 'SchemaAttrValue',

    dataTemplates : {
      values : '.TPL/data/values.html'
    },
   
    tempTemplates : {
      view : '.TPL/temp/view.html'
    }
  });
});
