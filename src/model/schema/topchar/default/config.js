angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModelType('Schema/TopicCharacteristic', 'default', {
    initData : { 'attributeGroups' : 'AttributeGroup' },

    dataTemplates : {
      core   : '.TPL/data/core.html',
      groups : '.TPL/data/groups.html'
    },

    tempTemplates : {
      editModel : '.TPL/temp/editModel.html',
      editType  : '.TPL/temp/editType.html'
    }
  });
});
