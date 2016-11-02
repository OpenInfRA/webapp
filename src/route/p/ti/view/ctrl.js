angular.module('oi.route').controller('oiRouteProjectTopInstHomeCtrl', function($scope, $state, $log, oiApp, modelProject, modelTopInst) {
  'use strict';

  oiApp.loading(true);

  var mod = modelTopInst;

  $scope.$data = mod.typeData(true);

  mod.relations().then(function(list) {
    var media = [], childs = [], refs = [];

    for (var i in list) {
      var rel = list[i];
          rel.noPager = true;
          rel.size    = 10;

      if (rel.relation.$end.type === 'webapp.image') {
        media.push(rel);

      } else if (rel.relation.$end.isChild) {
        childs.push(rel);

      } else {
        refs.push(rel);
      }
    }

    $scope.relMedia      = media;
    $scope.relChildren   = childs;
    $scope.relReferences = refs;

  })['finally'](function() {
    oiApp.loading(false);
  });

});
