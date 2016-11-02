angular.module('oi.route').controller('oiRouteProjectTopInstRelationCtrl', function($log, $scope, $state, $stateParams, modelTopInst, relation) {
  'use strict';

  var tc_obj = relation.topchar;

  $scope.topcharNames = tc_obj.loaded.data.topic.name;
  $scope.topcharUUID  = tc_obj.uuid;

  $scope.$list = relation;

  /* ------------------------------------------------------------------ */

  // $scope.$data = obj.loaded.data;
  // $scope.$list = obj.buildTopInstList({ size : 30 });
});
