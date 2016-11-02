angular.module('oi.assets').service('oiAssets', function (oiConfig, $document, $q, $timeout, $log) {
  'use strict';
  
  var LATE = oiConfig.urlApp+'/assets/late/';
  var LOAD = {};

  var _load_asset = function(rel) {
    var url = LATE + rel;

    if (LOAD[url] !== true) {
      var q = $q.defer();

      var scr = $document[0].createElement('script');
          scr.src = url;

      scr.onload = scr.onreadystatechange = function(e) {
        $timeout(function() { q.resolve(e); });
      };

      scr.onerror = function(e) {
        $timeout(function() { q.reject(e); });
      };

      $document[0].head.appendChild(scr);
      
      LOAD[url] = q.promise;
    }

    return LOAD[url];
  };

  var _load_seq = function(list) {
    var rel = list.shift();
   
    return _load_asset(rel).then(function() {
      if (list.length === 1) { return _load_asset(list[0]); }

      return _load_seq(list);
    });
  };

  /* ------------------------------------------------------------------ */

  this.loadLate = function() {
    if (arguments.length === 0) { return $q.resolve(); }
    if (arguments.length === 1) { return _load_asset(arguments[0]); }

    var args = [].slice.call(arguments, 0);

    return _load_seq(args);
  };

  /* ------------------------------------------------------------------ */
});
