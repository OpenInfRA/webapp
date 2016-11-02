angular.module('oi.route').controller('oiRouteProjectTopInstCtrl', function($q, $log, $scope, modelTopInst, oiApp) {
  'use strict';

  var    obj  = modelTopInst,
      tc_obj  = obj.topchar,
      tc_util = tc_obj.util;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _load_parents = function() {
    if (!tc_obj.canParent()) {
      $scope.canParents = false;
      return;
    }

    $scope.canParents = true;
 
    return obj.dataParents().then(function(list) {
      for (var i in list) {
        var    item = list[i],
            tc_uuid = item.topicCharacteristic.uuid,
             p_inst = item.parentInstance;

        item.topcharUUID  = tc_uuid;
        item.topcharNames = item.topicCharacteristic.topic.name;

        item.topinstLabels = tc_util.dataLabels(tc_uuid, item);

        if (p_inst) {
          item.parUUID        = p_inst.uuid;
          item.parTopCharUUID = p_inst.topicCharacteristic.uuid;
        }
      }

      $scope.parents = list;
      $scope.parentInstance = list[ list.length - 1 ];
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  $scope.topinstLabels = obj.dataLabels();

  $scope.topcharNames = tc_obj.loaded.data.topic.name;
  $scope.topcharUUID  = tc_obj.uuid;
  $scope.topinstUUID  =    obj.uuid;

  $scope.parentRelation = obj.parentRelation();

  oiApp.loading(true);

  $q.all([
    _load_parents()

  ])['finally'](function() {
    oiApp.loading(false);
  });
});
