angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value.varchar', {
    valueDataType : 'varchar',
    template : '.TPL/view.html'
  });
});
