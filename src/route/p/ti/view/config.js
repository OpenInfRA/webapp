angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.topinst.view', {
      url : '/',
      controller : 'oiRouteProjectTopInstHomeCtrl',
      templateUrl : '.TPL/view.html'
    });
});
