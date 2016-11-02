angular.module('oi.route').controller('oiRouteProjectConfigTopCharAttrSortCtrl', function($log, $scope, $state, oiApp, modelTopChar) {
  'use strict';

  var obj = modelTopChar;

  /* ------------------------------------------------------------------ */

  $scope.abort  = function() { $state.go('^'); };

  $scope.submit = function() { 
    oiApp.busy();

    obj.dataUpdate($scope.data).then(function() { 
      oiApp.idle();
      $state.go('^'); 
    }); 
  };

  /* ------------------------------------------------------------------ */

  $scope.data = angular.copy(obj.loaded.data);
});
