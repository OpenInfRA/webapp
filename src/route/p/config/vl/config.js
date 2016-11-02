angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.valuelist', {
      url : '/vl/:valuelistUUID',
      resolve : {
        modelValueList : function($stateParams, $q, $log, modelProject) {
          var vl = modelProject.getValueList($stateParams.valuelistUUID);
          if (!vl) { return $q.reject(); }

          return vl.init();
        }
      },

      controller  : 'oiRouteProjectConfigValueListCtrl',
      templateUrl : '.TPL/view.html'
    });
});
