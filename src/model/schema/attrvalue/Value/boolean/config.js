angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value.boolean', {
    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
