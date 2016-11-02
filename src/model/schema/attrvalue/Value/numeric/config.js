angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value.numeric', {
    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
