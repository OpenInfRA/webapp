angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/TopicInstance', 'default', {
    initData : { 'attributeValueGroups' : 'AttributeValueGroup' },

    dataTemplates : {
      groups : '.TPL/data/groups.html'
    },

    listTemplates : {
      view : {
        templateUrl : '.TPL/list/view.html',
        controller  : 'oiModelSchemaTopInstListCtrl'
      },

      media : {
        templateUrl : '.TPL/list/media.html',
        controller  : 'oiModelSchemaTopInstListMediaCtrl'
      }
    }
  });
});
