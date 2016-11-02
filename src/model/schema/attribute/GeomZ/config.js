angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'GeomZ', {
    valueType     : 'geomz',
    valueDataType : 'geometry(GeometryZ)',

    configuration : {
      uneditable : true
    },
 
    dataTemplates : {
      view : '.TPL/view.html'
    }
  });
});
