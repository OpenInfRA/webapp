angular.module('oi.directive').directive('oiInputLocalized', function() {
  'use strict';

  // <oi-input-localized strings="{ .. }" locales="<oiModelLocalFactory>"></oi-input-localized>

  return {
    restrict : 'E',
    scope : {
      strings : '=',
      locales : '='
    },
    templateUrl : '.TPL/input.html'
  };
});
