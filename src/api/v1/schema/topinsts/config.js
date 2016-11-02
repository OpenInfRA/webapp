angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/topicinstances/:id', {
    utilFactory : 'oiApiV1SchemaTopInstUtilFactory',
    dataModel   : 'TopicInstance',
    metadata    : 'topic_instance'
  });

  oiBackendApiProvider.api('v1/$schema/topicinstances/:id/associationsto', {
    dataModel   : 'Association'
  });

  oiBackendApiProvider.api('v1/$schema/topicinstances/:id/associationsfrom', {
    dataModel   : 'Association'
  });
});
