angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.topinst.topchar', {
      url : '/tc/:topcharUUID',

      resolve : {
        relation : function($stateParams, $q, $log, modelTopInst) {
          return modelTopInst.loadTopCharRelationList($stateParams.topcharUUID);
        }
      },

      controller  : 'oiRouteProjectTopInstTopCharCtrl',
      templateUrl : '.TPL/view.html'
    });
});
