angular.module('oi.model').config(function(oiModelProvider) {
  'use strict';

  oiModelProvider.defineModel('Project', {
    'extends' : 'Schema'
  });
});
