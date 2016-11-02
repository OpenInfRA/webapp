angular.module('oi.directive').directive('oiTextareaLocalized', function() {
  'use strict';

  // <oi-textarea-localized strings="{ .. }" locales="<oiModelLocalFactory>"></oi-textarea-localized>

  return {
    restrict : 'E',
    scope : {
      strings : '=',
      locales : '='
    },
    templateUrl : '.TPL/textarea.html'
  };
});
