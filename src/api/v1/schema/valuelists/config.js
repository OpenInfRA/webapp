angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/valuelists/:id', {
    crud : true,
    dataModel : 'ValueList',
    utilFactory : 'oiApiV1SchemaValueListsUtilFactory'
  });

  oiBackendApiProvider.api('v1/$schema/valuelists/:id/valuelistvalues/:id', {
    crud : true,
    dataModel : 'ValueListValue'
  });

  oiBackendApiProvider.api('v1/$schema/valuelistvalues', {
    crud : true,
    dataModel : 'ValueListValue',
    mergeInto : [ 'names', 'descriptions' ]
  });
});
