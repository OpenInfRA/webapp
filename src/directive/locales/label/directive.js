angular.module('oi.directive').directive('oiLabelLocalized', function() {
  'use strict';

  // <oi-label-localized strings="{ .. }" locales="<oiModelLocalFactory>"></oi-input-localized>

  return {
    restrict : 'E',
    scope : {
      strings : '=',
      locales : '='
    },
    templateUrl : '.TPL/label.html'
  };
});
