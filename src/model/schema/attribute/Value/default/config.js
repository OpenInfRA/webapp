angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Value', {
    valueType : 'value',

    dataTemplates : {
      view : '.TPL/data/view.html'
    },

    tempTemplates : {
      editDataType : '.TPL/temp/editDataType.html'
    }
  });
});
