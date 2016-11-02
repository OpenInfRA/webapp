angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.numeric', {
    valueDataType : 'numeric',

    hasUnit : true,

    template : '.TPL/view.html'
  });
});
