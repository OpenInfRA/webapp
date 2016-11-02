angular.module('oi.backend').directive('oiBackendPane', function(oiDirective, oiBackendFactory) {
  'use strict';

  // <ANY oi-backend-pane="oiApp.backend"/> 
  return oiDirective.buildReloadDirective('oiBackendPane', {
    instanceOf : oiBackendFactory,
    template   : '.TPL/backend.html'
  });
});
