angular.module('oi.route').controller('oiRouteProjectConfigTopCharEditCtrl', function($log, $scope, $state, oiApp, modelTopChar, tempObject) {
  'use strict';

  var obj = modelTopChar;

  /* ------------------------------------------------------------------ */

  $scope.abort = function() { $state.go('^.home'); };

  $scope.submit = function() {
    oiApp.busy();
 
    obj.dataUpdate($scope.temp).then(function() {
      oiApp.idle();
      $state.go('^.home'); 
    });
  };

  /* ------------------------------------------------------------------ */

  $scope.name = angular.copy(obj.loaded.data.topic.name);
  $scope.temp = tempObject;

  $scope.locales = obj.schema.locales();
});
