angular.module('oi.util').service('oiUtilProto', function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* .on(key, function(args) {}), .fire(key, args);                     */
  /* ------------------------------------------------------------------ */

  var _on = function(ons, key, fn) {
    var that;

    if (angular.isArray(fn)) {
      that = fn[1];
        fn = fn[0];
    }

    if (typeof(fn) !== 'function') { return; }

    var fns = ons[key] || (ons[key] = []);
        fns.push([ fn, that ]);
  };

  this.on = function(key, fn) {
    if (!key) { return; }
    var ons = this.__util_onfire || (this.__util_onfire = {});

    var to = typeof(key);

    if ((to === 'string') && fn) {
      _on(ons, key, fn);

    } else if (to === 'object') {
      for (var k in key) {
        if (key.hasOwnProperty(k)) {
          _on(ons, k, key[k]);
        }
      }
    }
  };

  this.fire = function(key, args) {
    var ons = this.__util_onfire;
    if (!ons) { return; }

    var fns = ons[key];
    if (!fns) { return; }

    var len = fns.length;
    if (!len) { return; }

    for (var i = 0; i < len; i++) {
      var fnt = fns[i];
      fnt[0].call((fnt[1] || this), args);
    }
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

});
