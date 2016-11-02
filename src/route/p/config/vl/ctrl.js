angular.module('oi.route').controller('oiRouteProjectConfigValueListCtrl', function($scope, $state, $log, modelValueList, oiApp) {
  'use strict';

  var obj = modelValueList;

  /* ------------------------------------------------------------------ */

  $scope.names = obj.loaded.get.names;

  oiApp.loading(true);
  
  obj.values().then(function(list) {
    $scope.list = list;

  })['finally'](function() {
    oiApp.loading(false);
  });
});
