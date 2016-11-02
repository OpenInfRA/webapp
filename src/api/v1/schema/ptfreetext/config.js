angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/ptfreetext', {
    factory : 'oiApiV1SchemaPTFreeTextUtilFactory',
    crud : { update : false, destroy : false }
  });
});
