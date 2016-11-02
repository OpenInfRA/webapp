angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/attributetypegroups/:id/topiccharacteristics/:id', {
    crud : true
  });

});
