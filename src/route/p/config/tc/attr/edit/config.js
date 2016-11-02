angular.module('oi.route').config(function($stateProvider) {
  'use strict';

  $stateProvider
    .state('project.config.topchar.attr.edit', {
      url : '/edit',
      views : { '@project.config.topchar' : {
        controller : 'oiRouteProjectConfigTopCharAttrEditCtrl',
        templateUrl : '.TPL/view.html'
      }},
      resolve : {
        tempObject : function($q, modelTopChar) {
          var temp = modelTopChar.typeTemp();
          return $q.when(temp.init()).then(function() { return temp; });
        }
      }
    });
});
