angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('home', {
      url : '/',
      controller  : 'oiRouteHomeCtrl',
      templateUrl : '.TPL/view.html'
    });
});
