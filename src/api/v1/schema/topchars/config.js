angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/topiccharacteristics/:id', {
    utilFactory : 'oiApiV1SchemaTopCharUtilFactory',
    dataModel   : 'TopicCharacteristic',
    metadata    : 'topic_characteristic'
  });

  oiBackendApiProvider.api('v1/$schema/topiccharacteristics/:id/topicinstances/:id', {
    dataModel   : 'TopicInstance'
  });
});
