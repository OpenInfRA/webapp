angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/ptlocales', {
    factory : 'oiApiV1SchemaPTLocalesUtilFactory',
    crud : false
  });
});
