angular.module('oi.route').controller('oiRouteProjectConfigTopCharsCtrl', function($scope, $log, modelProject, oiUtilLocalize) {
  'use strict';

  var obj = modelProject;

  /* ------------------------------------------------------------------ */

  var _name = function(tc) { return oiUtilLocalize.localize(tc.topic.name); };

  var tcs  = obj.topchars;
  var list = [];

  for (var uuid in tcs) {
    list.push( tcs[uuid] );
  }

  list.sort(function(a, b) {
    var namea = _name(a);
    var nameb = _name(b);
  
    return namea.localeCompare(nameb);
  });

  $scope.topchars = list;
});
