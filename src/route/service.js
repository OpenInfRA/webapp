angular.module('oi.route').service('oiRoute', function ($window, $rootScope, $state, $urlRouter, $log, oiApp, oiConfig) {
  'use strict';

  var blocked;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // beim start routing unterdruecken, bis die app alle notwendigen 
  // initialisierungen durchgefuehrt hat. damit ist dann auch sicher-
  // gestellt, das die route resolves auf einer entsprechenden session
  // durchgefuehrt werden, resp. rollen getestet werden koennen.

  this.blockRouting = function() {
    blocked = $rootScope.$on('$stateChangeStart', function(e) { e.preventDefault(); });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // nach der initialisierung kann das routing aktiviert werden. d.h.
  // die event-handler werden registiert und die bisherige sperre 
  // aufgehoben, sowieso den router mitgeteilt, das er loslegen soll (sync)

  this.startRouting = function(app) {
    $rootScope.$state = $state;

    // externe links werden durch states mit dem attribute external:true 
    // abgebildet und muessen entsprechend zu echten externen links 
    // gemacht werden
  
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      app.loading(true);

      if (toState.external) {
        e.preventDefault();
  
        var url = oiConfig.external[toState.external];
        if (toParams.query) { url += '?'+toParams.query; }
  
        $window.open(url, '_self');
      }
    });
  
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
      app.loading(false);
    });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
      app.loading(false);

      if (!error) { error = {}; }
  
      if (error.status === 401) { 
        oiApp.backend.clearCaches();
      }
  
      if (error.status === 403) { $state.transitionTo('home'); }
    });

    /* ---------------------------------------------------------------- */

    if (blocked) {
      blocked();
      blocked = undefined;

      $urlRouter.sync();
    }
  };
});
