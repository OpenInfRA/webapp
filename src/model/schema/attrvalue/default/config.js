angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/AttributeValue', 'default', {
    utilFactory : 'SchemaAttrValue',

    dataTemplates : {
      view   : '.TPL/data/view.html',
      values : '.TPL/data/values.html'
    }
  });
});
