angular.module('oi.route').controller('oiRouteHomeCtrl', function($scope, $log, oiApp) {
  'use strict';

  oiApp.backend.projects().then(function(list) {
    $scope.projects = list;
  });
});
