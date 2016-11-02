angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/webapp/:id/projects/:id', {
    utilFactory : 'oiApiV1WebAppProjectsUtilFactory'
  });
});
