angular.module('oi.route').controller('oiRouteProjectTopInstEditCtrl', function($q, $log, $scope, $state, modelTopInst, tempObject) {
  'use strict';

  var obj = modelTopInst;
  var loc = obj.api.shared.schema.locales();

  // var pn = angular.element( document.querySelector( '#oi-progress' ) );

  /* ------------------------------------------------------------------ */

  $scope.filterAVG = function(item) {
    if (item.configuration.hidden) { return; }

    return true;
  };

  $scope.filterAV = function(item) {
    if (item.configuration.hidden) { return; }

    if (item.configuration.uneditable) { return; }

    return true;
  };

  /* ------------------------------------------------------------------ */

  $scope.abort  = function() { $state.go('^.view'); };
  $scope.submit = function() { 
    $scope.busy = true;
    $state.go('^.view'); 
/*

    obj.dataUpdate(tempObject).then(function() { 
      $state.go('^'); 

    }, function() {}, function(pro) {
      pn.css('width', Math.round(pro*100)+'%');

    })['finally'](function() {
      $scope.busy = false;
    });
*/
  };

  /* ------------------------------------------------------------------ */

  $scope.temp = tempObject;
  $scope.locales = loc;
});
