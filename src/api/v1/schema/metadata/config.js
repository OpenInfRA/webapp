angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/metadata', {
    factory : 'oiApiV1SchemaMetadataUtilFactory'
  });
});
