angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/attributetypes/:id', {
    crud : true,
    mergeInto : [ 'names', 'descriptions', 'unit' ]
  });

});
