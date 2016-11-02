angular.module('oi.model').controller('oiModelSchemaAttrValueGeomCtrl', function($scope, $element, oiAssetsOpenLayers, $state, $interval, $log) {
  'use strict';

  var data = $scope.$data;

  // unique id for map div
  var map_id = $scope.map_id = 'geom_' + data.uuid;

  $scope.redirectToMap = function() {
    var ti = data.up.up;

    var topcharUUID = ti.data.topicCharacteristic.uuid;
    var topinstUUID = ti.uuid;

    var query = 'tc='+ topcharUUID + '&ti=' + topinstUUID;
    $state.go('webgis.query', { query : query });
  };

  var _map_visible = function() {
    return !!$element[0].offsetHeight;
  };

  var _init_map = function() {
    oiAssetsOpenLayers.createPreview(map_id, JSON.parse(data.data.values[0]));
  };

  var max = 100;

  // if map-div not yet visible, test every 100ms
  var stop = $interval(function() {
    max--;

    if (max < 0) {
      $interval.cancel(stop);
      return;
    }

    if (!_map_visible()) { return; }

    $interval.cancel(stop);
    _init_map();
  }, 100);

  oiAssetsOpenLayers.init(); // late loading bereits ausloesen
});
