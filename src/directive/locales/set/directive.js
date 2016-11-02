angular.module('oi.directive').directive('oiSetLocale', function() {
  'use strict';

  // <oi-set-locale locales="<oiModelLocalFactory>"></oi-set-locale>

  return {
    restrict : 'E',
    scope : {
      locales : '=',
      all     : '@'
    },
    templateUrl : '.TPL/select.html'
  };
});
