angular.module('oi.route').controller('oiRouteWebGisQueryCtrl', function($scope, $state, $log) {
  'use strict';

  var url = '/APP/iframes/webgis.html?' +  $state.params.query;

  $scope.webgis = { url : url };
});
