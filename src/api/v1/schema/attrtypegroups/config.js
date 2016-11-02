angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/attributetypegroups/:id', {
    crud : true,
    mergeInto : [ 'names', 'descriptions' ]
  });

});
