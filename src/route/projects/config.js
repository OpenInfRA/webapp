angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('projects', {
      'abstract' : true,
      url : '/projects/',
      template : '<div ui-view></div>'
    })

      .state('projects.list', {
        url : '',
        controller : 'oiRouteProjectsListCtrl',
        templateUrl : '.TPL/list.html'
      });
});
