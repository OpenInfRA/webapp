angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Schema/AttributeGroup', {
    configOf : 'AttributeTypeGroup'
  });
});
