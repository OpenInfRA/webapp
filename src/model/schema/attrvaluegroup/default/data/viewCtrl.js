angular.module('oi.model').controller('oiModelSchemaAttrValueGroupDefaultCtrl', function($log, $scope) {
  'use strict';

  var data = $scope.$data;
  var conf = data.configuration;
  var cmod = conf.model || {};

  $scope.open = !cmod.closed;

  $scope.filterAV = function(av) {
    if (av.configuration.hidden) { return false; }

    if (!av.data.values.length) { return false; }

    return true;
  };

});
