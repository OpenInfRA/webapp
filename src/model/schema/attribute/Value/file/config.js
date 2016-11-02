angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.file', {
    valueDataType : 'file',
    template : '.TPL/view.html'
  });
});
