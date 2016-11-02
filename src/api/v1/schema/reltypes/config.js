angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/relationshiptypes/:id', {
    utilFactory : 'oiApiV1SchemaRelTypesUtilFactory',
    crud : true
  });
});
