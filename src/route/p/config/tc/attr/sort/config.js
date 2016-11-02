angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider.state('project.config.topchar.attr.sort', {
    url : '/sort',
    views : { '@project.config.topchar' : {
      controller : 'oiRouteProjectConfigTopCharAttrSortCtrl',
      templateUrl : '.TPL/view.html'
    }}
  });
});
