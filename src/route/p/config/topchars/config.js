angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.topchars', {
      url : '/topchars',
      controller  : 'oiRouteProjectConfigTopCharsCtrl',
      templateUrl : '.TPL/view.html'
    });
});
