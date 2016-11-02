angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.valuelists', {
      url : '/valuelists',
      controller  : 'oiRouteProjectConfigValueListsCtrl',
      templateUrl : '.TPL/view.html'
    });
});
