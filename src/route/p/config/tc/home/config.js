angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.topchar.home', {
      url : '/',
      controller : function($scope, modelTopChar) {
        $scope.data = modelTopChar.typeData();
      },
      templateUrl : '.TPL/view.html'
    });

});
