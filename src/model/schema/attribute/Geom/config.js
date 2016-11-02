angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'Geom', {
    valueType     : 'geom',
    valueDataType : 'geometry(Geometry)',

    configuration : {
      uneditable : true
    },

    dataTemplates : {
      view : '.TPL/view.html'
    }
  });
});
