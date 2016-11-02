angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Schema/ValueList', {
    utilFactory : true,
    utilApi     : 'valuelists'
  });
});
