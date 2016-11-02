angular.module('oi').run(function($rootScope, $log, oiApp, oiRoute, oiConfig) {
  'use strict';
 
  $rootScope.oiApp = oiApp;

  $rootScope.oi = {
    client : { version : oiConfig.version },
    server : { version : '?' },
    progress : {}
  };

  // routing aussetzen, bis wir sauber durchgestartet sind
  oiRoute.blockRouting();

  oiApp.init().then(function() {
    // ab jetzt darf das routing uebernehmen
    oiRoute.startRouting(oiApp);
  });
});
