angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Schema/TopicInstance', {
    alias : 'TopInst',

    utilFactory : true,
    utilApi     : 'topicinstances',

    instanceOf  : 'TopicCharacteristic',
    configData  : 'topicCharacteristic'
  });
});
