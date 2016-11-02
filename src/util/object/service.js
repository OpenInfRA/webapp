angular.module('oi.util').service('oiUtilObject', function ($log, $injector) {
  'use strict';
 
  var FACS = {};

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _fac = this.factory = function(factory) {
    var fac = FACS[factory];
    if (fac) { return fac; }

    try {
      fac = $injector.get(factory, 'oiUtilObject.factory');

    } catch(e) {
      $log.error('missing factory for', factory, e);
      return;
    }

    FACS[factory] = fac;

    return fac;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.create = function(factory, base, args) {
    if (arguments.length < 1) { return; }
    if (typeof(factory) !== 'string') { return; }

    var fac = _fac(factory);
    if (!fac) { return; }

    if (!angular.isObject(base)) { base = {}; }
    if (!angular.isObject(args)) { args = {}; }

    var obj;

    try {
      obj = new fac(base, args);

    } catch (e) {
      $log.error('couldn\'t create object for', factory, e);
      return;
    }

    return obj;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.invoke = function(factory, args) {
    if (arguments.length < 1) { return; }
    if (typeof(factory) !== 'string') { return; }

    var fac = _fac(factory);
    if (!fac) { return; }

    if (!angular.isArray(args)) { args = []; }

    // we create an ad hoc constructor that calls the 
    // real constructor function with the given arguments
    // on the created this object

    function FN() { // we have a this!
      return fac.apply(this, args);
    }

    FN.prototype = fac.prototype; // FIX prototype

    var obj = new FN();
        obj.constructor = fac; // FIX hierarchie!

    return obj;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
});
