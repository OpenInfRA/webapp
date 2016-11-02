angular.module('oi.route').controller('oiRouteProjectTopCharCtrl', function($scope, $state, $log, modelTopChar) {
  'use strict';

  var obj = modelTopChar;

  /* ------------------------------------------------------------------ */

  $scope.$data = obj.loaded.data;
  $scope.$list = obj.buildTopInstList({ size : 30 });
});
