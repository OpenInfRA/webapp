angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.image', {
    valueDataType : 'image',
    template : '.TPL/view.html'
  });
});
