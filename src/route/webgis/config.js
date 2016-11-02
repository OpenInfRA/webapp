angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider.state('webgis', {
    url : '/webgis',
    templateUrl : '.TPL/view.html'
  }).
    state('webgis.query', {
      url : '/:query',
      views : {
        '@' : { 
          controller : 'oiRouteWebGisQueryCtrl',
          templateUrl : '.TPL/query.html'
        }
      }
    });
});
