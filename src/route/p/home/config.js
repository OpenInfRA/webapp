angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.home', {
      url : '/',
      controller : 'oiRouteProjectHomeCtrl',
      templateUrl : '.TPL/view.html'
    });
});
