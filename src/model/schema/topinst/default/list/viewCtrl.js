angular.module('oi.model').controller('oiModelSchemaTopInstListCtrl', function($q, $log, $scope) {
  'use strict';

  var $list = $scope.$list,
       tc   = $list.topchar;

  var fn_data_labels = tc.fnDataLabels();

  $scope.listPage  = 1;
  $scope.listSize  = $list.size;
  $scope.listCount = $list.count;

  $scope.showPager = !$list.noPager;

  var _load_page = function() {
    $scope.listLoading = true;

    var list = [];
         
    $list.enumeratePageData($scope.listPage, function(item, i) {
      item.$labels = fn_data_labels(item);
      list[i] = item;

    }).then(function() {
      $scope.list = list;

    })['finally'](function() {
      $scope.listLoading = false;
    });
  };

  $scope.$watch('listPage', _load_page);
});
