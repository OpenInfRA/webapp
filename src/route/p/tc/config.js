angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.topchar', {
      url : '/tc/:topcharUUID',

      resolve : { 
        modelTopChar : function($stateParams, $q, $log, modelProject) {
          var tc = modelProject.getTopChar($stateParams.topcharUUID);
          if (!tc) { return $q.reject(); }

          return tc.init();
        }
      },

      controller  : 'oiRouteProjectTopCharCtrl',
      templateUrl : '.TPL/view.html'
    });
});
