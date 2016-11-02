angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.boolean', {
    valueDataType : 'boolean',
    template : '.TPL/view.html'
  });
});
