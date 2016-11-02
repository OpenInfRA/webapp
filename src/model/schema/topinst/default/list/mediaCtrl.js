angular.module('oi.model').controller('oiModelSchemaTopInstListMediaCtrl', function($q, $log, $scope) {
  'use strict';

  var $list = $scope.$list;

  $list.size = $list.count;

  $scope.listPage  = 1;
  $scope.listSize  = $list.size;
  $scope.listCount = $list.count;

  var attr = $list.topchar.config('image.attr');

  var _load_page = function() {
    if (!attr) { return; }

    $scope.listLoading = true;

    var list = [];
         
    $list.enumeratePageData($scope.listPage, function(item, i) {
      var value = item.values[attr];

      if (value) { item.fotoUUID = value.xx; }
      list[i] = item;

    }).then(function() {
      $scope.list = list;

    })['finally'](function() {
      $scope.listLoading = false;
    });
  };

  $scope.$watch('listPage', _load_page);
});
