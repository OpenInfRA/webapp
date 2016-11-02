angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value.integer', {
    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
