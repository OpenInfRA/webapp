angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Schema/TopicCharacteristic', {
    alias : 'TopChar',

    utilFactory : true,
    utilApi     : 'topiccharacteristics',

    configOf : 'TopicInstance'
  });
});
