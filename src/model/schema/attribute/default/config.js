angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/Attribute', 'default', {
    valueDataType : 'varchar',

    dataTemplates : {
      view : '.TPL/data/view.html'
    },

    tempTemplates : {
      viewModel : '.TPL/temp/viewModel.html',
      viewType  : '.TPL/temp/viewType.html',

      editModel    : '.TPL/temp/editModel.html',
      editDataType : '.TPL/temp/editDataType.html',
      editType     : '.TPL/temp/editType.html'
    }
  });
});
