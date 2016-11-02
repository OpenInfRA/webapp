angular.module('oi.route').controller('oiRouteProjectConfigValueListsCtrl', function($scope, $log, oiApp, modelProject) {
  'use strict';

  oiApp.loading(true);

  modelProject.getValueLists().then(function(list) {
    $scope.list = list;

  })['finally'](function() {
    oiApp.loading(false);
  });
});
