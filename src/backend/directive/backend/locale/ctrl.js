angular.module('oi.backend').controller('oiBackendPaneLocaleCtrl', function($scope, oiUtilLocalize) {
  'use strict';

  $scope.currentLocale  = oiUtilLocalize.current();
  $scope.currentLocales = oiUtilLocalize.locales();

  $scope.changeLanguage = function(locale) {
    oiUtilLocalize.use(locale);
  };
});
