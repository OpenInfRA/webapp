angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Schema/AttributeValue', {
    instanceOf : 'Attribute',
    configData : 'attribute'
  });
});
