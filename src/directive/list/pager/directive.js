angular.module('oi.directive').directive('oiListPager', function() {
  'use strict';

  // <oi-list-pager model="..."></oi-list-pager>

  return {
    restrict : 'E',
    scope : {
      count : '=',
      page  : '=',
      size  : '='
    },
    controller  : 'oiDirectiveListPagerCtrl',
    templateUrl : '.TPL/view.html'
  };
});
