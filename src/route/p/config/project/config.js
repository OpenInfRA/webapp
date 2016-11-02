angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.project', {
      url : '/project',
        templateUrl : '.TPL/view.html'
      });
});
