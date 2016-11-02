angular.module('oi.api').config(function(oiBackendApiProvider, oiApiV1SchemaConfig) {
  'use strict';

  var config = angular.extend({}, oiApiV1SchemaConfig, {
    factory  : 'oiApiV1ProjectsObjectFactory',
    metadata : 'project'
  });

  oiBackendApiProvider.api('v1/projects/:id', config);
});
