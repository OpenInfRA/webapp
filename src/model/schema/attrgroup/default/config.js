angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeGroup', 'default', {
    initData : { 'attributes' : 'Attribute' },

    dataTemplates : {
      view : '.TPL/data/view.html'
    },

    tempTemplates : {
      viewModel : '.TPL/temp/viewModel.html',
      viewType  : '.TPL/temp/viewType.html',

      editModel : '.TPL/temp/editModel.html',
      editType  : '.TPL/temp/editType.html'
    }
  });
});
