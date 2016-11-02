angular.module('oi.route').controller('oiRouteProjectsListCtrl', function($scope, $log, oiApp) {
  'use strict';

  oiApp.backend.projects().then(function(list) {
    $scope.list = list;
  });
});
