angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project', {
      'abstract' : true,
      url : '/p/:projectUUID',
      resolve : { 
        modelProject : function($state, $stateParams, $q, $log, oiApp) {
          var pro = oiApp.model.getProject($stateParams.projectUUID);
          if (!pro) { return $q.reject(); }

          // wir laden das project und hinterlegen dann
          // das model object unter dem key und nicht die geladenen daten!
          return pro.init().then(function() { return pro; }, 
            function() { $log.log('project init failed'); return $q.reject(); });
        }
      },
      controller : 'oiRouteProjectCtrl',
      templateUrl : '.TPL/view.html'
    });

});
