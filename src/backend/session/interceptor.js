angular.module('oi.backend').factory('oiBackendSessionInterceptor', function ($q, $log, $injector) {
  'use strict';

  var responseError = function (response) {
    if (response.status === 401) {
      var UA;
      try { UA = response.config.headers['User-Agent']; } catch(e) {}

      // we use the user agent to mark authentication requests
      // so we can ignore them when the app is authenticating a user
      // if there are any fails, we must pass these fails to prevent loops

      if (UA !== 'OpenInfraSession') {
        var oiApp = $injector.get('oiApp');
        if (oiApp) {
          // once the user manages to re authenticated, we reload
          // his http requests otherwise they fail eventually

          return oiApp.requireLogin({ timeout : true }).then(function() {
            var $http = $injector.get('$http');
            return $http(response.config);

          }, function() {
            return $q.reject(response);
          });
        }
      }
    }

    return $q.reject(response);
  };

  return {
    responseError: responseError
  };
});
