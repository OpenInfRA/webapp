angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Schema/Relation', {
    utilFactory : true,
    utilApi     : 'relationshiptypes'
  });
});
