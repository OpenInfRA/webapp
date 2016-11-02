angular.module('oi.route').controller('oiRouteProjectConfigTopCharCtrl', function($log, $scope, $state, modelTopChar) {
  'use strict';

  var obj = modelTopChar;

  $scope.uuid = obj.uuid;
  $scope.data = obj.typeData();
});
