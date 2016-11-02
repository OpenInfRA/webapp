angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'Domain', {
    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
