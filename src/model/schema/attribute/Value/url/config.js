angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.text', {
    valueDataType : 'text',
    template : '.TPL/view.html'
  });
});
