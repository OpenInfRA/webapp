angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
        .state('project.topinst.edit', {
          url : '/edit',
          resolve : {
            tempObject : function($q, $log, modelTopInst) {
              var temp = modelTopInst.typeTemp();
              return $q.when(temp.init()).then(function() { return temp; });
            }
          },
          controller : 'oiRouteProjectTopInstEditCtrl as editCtrl',
          templateUrl : '.TPL/view.html'
        });
});
