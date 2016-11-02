angular.module('oi.app').service('oiAppWaiting', function ($rootScope, $timeout, $log) {
  'use strict';

  var timeout, message, waiting = false, visible = false;

  var _opts = function(opts) {
    if (typeof(opts) === 'string') { return { message : opts }; }

    if (!angular.isObject(opts)) { return {}; }

    return opts;
  };

  this.start = function(opts) {
    opts = _opts(opts);

    message = opts.message;
    if (typeof(message) !== 'string') { message = 'loading'; } // FIXME

    waiting = true;
    visible = false;

    timeout = $timeout(function() { $rootScope.oi.waiting = message; visible = true; }, 300);
  };

  this.step = function(step) {
    if (typeof(step) !== 'string') { step = 'loading'; }

    message = step;
    if (visible) { $rootScope.oi.waiting = message; }
  };

  this.stop = function(opts, stateChange) {
    if (!waiting) { return; }

    opts = _opts(opts);

    if ((stateChange === 'success') && (opts.stop === false)) { return; }

    if (timeout) { $timeout.cancel(timeout); }

    $rootScope.oi.waiting = false;
                  waiting = false;
  };

});
