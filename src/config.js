angular.module('oi').config(function(oiConfig, $urlRouterProvider, $locationProvider, $translateProvider) {
  'use strict';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $translateProvider
    .useStaticFilesLoader({ prefix: oiConfig.urlApp+'/locales/', suffix: '.json' })
    .preferredLanguage('de')
    .useSanitizeValueStrategy('escape');
});
