angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  // artificial model and key

  oiModelProvider.defineModel('Schema/AttributeValueGroup', {
    instanceOf : 'AttributeGroup',
    configData : 'attributeGroup'
  });
});
