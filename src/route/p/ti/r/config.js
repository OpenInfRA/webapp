angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.topinst.relation', {
      url : '/r/:relationUUID',

      resolve : {
        relation : function($stateParams, $q, $log, modelTopInst) {
          return modelTopInst.loadRelationList($stateParams.relationUUID);
        }
      },

      controller  : 'oiRouteProjectTopInstRelationCtrl',
      templateUrl : '.TPL/view.html'
    });
});
