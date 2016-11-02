angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'GeomZ', {
    dataTemplates : {
      values : '.TPL/data/values.html'
    }
  });
});
