angular.module('oi.route').controller('oiRouteProjectHomeCtrl', function($scope, $state, $log, modelProject) {
  'use strict';

  var obj  = modelProject;
  var uuid = obj.uuid;

  /* ------------------------------------------------------------------ */

  $scope.projectUUID = uuid;

  $scope.names    = obj.loaded.get.names;
  $scope.descrs   = obj.loaded.get.descriptions;

  $scope.topchars = obj.topchars;

  $scope.edit = function() {
    $log.log('edit');
  };
});
