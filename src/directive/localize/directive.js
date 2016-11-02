angular.module('oi.directive').directive('oiLocalize', function($log, oiUtilLocalize) {
  'use strict';

  var UUID = 0;

  return {
    restrict : 'A',
    link : function(scope, elem, attrs) {
      // create a unique id for each element to use as lookup if there 
      // are any changes triggered by $watch

      var uuid = ++UUID; 

      scope.$watch(attrs.oiLocalize, function(value) {
        oiUtilLocalize.element(value, elem, uuid, scope);
      }, true);
    }
  };
});
