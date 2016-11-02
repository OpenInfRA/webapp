angular.module('oi.backend').config(function($httpProvider) {
  'use strict';
  $httpProvider.interceptors.push('oiBackendSessionInterceptor');
});
