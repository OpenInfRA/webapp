angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.infix('schema', [ 'projects/:id', 'system' ]);
});
