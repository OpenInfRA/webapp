angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1/$schema/attributetypesattributetypegroupsassociations/:id', {
    crud : { update : true, create : false },
    utilFactory : 'oiApiV1SchemaAttributeUtilFactory',
    dataModel   : 'Attribute',
    mergeInto : [ 'order', 'multiplicity', 'attributeTypeGroup' ]
  });
});
