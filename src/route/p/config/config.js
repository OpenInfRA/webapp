angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config', {
      'abstract' : true,
      url : '/config',
      templateUrl : '.TPL/view.html'
    });

});
