angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Schema/Attribute', {
    configOf : 'AttributeType',

    customType : function(data) {
      return this.api.shared.attributes.modelType(data);
    }
  });
});
