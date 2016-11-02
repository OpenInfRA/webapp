angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.date', {
    valueDataType : 'date',
    template : '.TPL/view.html'
  });
});
