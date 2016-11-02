angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.integer', {
    valueDataType : 'integer',

    hasUnit : true,

    template : '.TPL/view.html'
  });
});
