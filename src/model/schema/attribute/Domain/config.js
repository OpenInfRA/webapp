angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Domain', {
    valueType : 'domain',

    dataTemplates : {
      view : '.TPL/view.html'
    }
  });
});
