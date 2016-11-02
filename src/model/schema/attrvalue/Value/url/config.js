angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Value.url', {
    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
