angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValueGroup', 'default', {
    initData : { 'attributeValues' : 'AttributeValue' },

    dataTemplates : {
      view : '.TPL/data/view.html'
    }
  });
});
