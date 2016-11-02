angular.module('oi.route').controller('oiRouteProjectCtrl', function($scope, $state, $log, modelProject) {
  'use strict';

  var obj = modelProject;

  /* ------------------------------------------------------------------ */

  $scope.search_submit = function(query) {
    if (!query) { return; }
    $state.go('project.search.query', { projectUUID : obj.uuid, query : query });
  };

  /* ------------------------------------------------------------------ */

  $scope.oiProject = modelProject;

  $scope.projectUUID = obj.uuid;
  $scope.names       = obj.loaded.get.names;
});
