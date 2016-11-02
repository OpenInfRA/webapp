angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value.date', {
    // utilFactory : 'SchemaAttrValueDate', TODO

    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
