angular.module('oi.directive').controller('oiDirectiveListPagerCtrl', function($scope, $log) {
  'use strict';

  var count =  parseInt($scope.count, 10),
       size =  parseInt($scope.size,  10),
       page = (parseInt($scope.page,  10) || 1),
       last = 1;

  var _update_view = function() {
    var fr = ((page - 1) * size) + 1;

    var to =  fr + size - 1;
    if (to > count) { to = count; }

    $scope.from = fr;
    $scope.to   = to;

    $scope.canFirst = (page === 1)    ? false : true;
    $scope.canPrior = (page   > 1)    ? true : false;
    $scope.canNext  = (page   < last) ? true : false;
    $scope.canLast  = (page === last) ? false : true;
  };

  var _set_page = function(pg) {
    if (pg > last) { pg = last; }
    if (pg <    1) { pg = 1;    }

    if (pg === page) { return false; }

    $scope.page = pg;

    return true;
  };

  var _init_view = function() {
    if (!count || !size) { return; }

    last = Math.ceil(count / size);

    if (!_set_page(page)) {
      _update_view();
    }
  };

  $scope.toFirst = function() { _set_page(1);      };
  $scope.toPrior = function() { _set_page(page-1); };
  $scope.toNext  = function() { _set_page(page+1); };
  $scope.toLast  = function() { _set_page(last);   };

  $scope.$watch('count', function(cnt) {
    cnt = parseInt(cnt, 10);
    if (count === cnt) { return; }

    count = cnt;
    _init_view();
  });

  $scope.$watch('size', function(sz) {
    sz = parseInt(sz, 10);
    if (size === sz) { return; }

    size = sz;
    _init_view();
  });

  $scope.$watch('page', function(pg) {
    pg = parseInt(pg, 10) || 1;
    if (page === pg) { return; }

    page = pg;
    _update_view();
  });

  _init_view();
});
