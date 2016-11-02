angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.home', {
      url : '/',
        templateUrl : '.TPL/view.html'
      });
});
