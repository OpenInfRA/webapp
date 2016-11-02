angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value.image', {
    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
