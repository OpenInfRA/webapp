angular.module('oi.api').config(function(oiBackendApiProvider, oiApiV1SchemaConfig) {
  'use strict';

  oiBackendApiProvider.api('v1/system', oiApiV1SchemaConfig);
});
