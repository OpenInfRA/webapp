angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.topchar', {
      'abstract' : true,
      url : '/tc/:topcharUUID',

      resolve : {
        modelTopChar : function($stateParams, $q, $log, modelProject) {
          var tc = modelProject.getTopChar($stateParams.topcharUUID);
          if (!tc) { return $q.reject(); }

          return tc.init();
        }
      },

      controller : 'oiRouteProjectConfigTopCharCtrl',
      templateUrl : '.TPL/view.html'
    });

});
