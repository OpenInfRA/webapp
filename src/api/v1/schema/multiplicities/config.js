angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/multiplicities', {
    factory : 'oiApiV1SchemaMultiplicitiesUtilFactory',
    crud : false
  });
});
