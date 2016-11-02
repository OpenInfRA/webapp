angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.topinst', {
      'abstract' : true,
      url : '/ti/:topinstUUID',

      resolve : { 
        modelTopInst : function($stateParams, $q, $log, modelProject) {
          var ti = modelProject.getTopInst($stateParams.topinstUUID);
          if (!ti) { return $q.reject(); }

          return ti.init();
        }
      },

      controller  : 'oiRouteProjectTopInstCtrl',
      templateUrl : '.TPL/view.html'
    });
});
