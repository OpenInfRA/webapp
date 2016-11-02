angular.module('oi.util').service('oiUtil', function ($log) {
  'use strict';
 

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.isEmpty = function(obj) {
    if (obj === null) { return true; }

    if ((typeof(obj) === 'string') || angular.isArray(obj)) { return !obj.length; }

    if (angular.isObject(obj)) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) { return false; }
      }
    }
  
    return true;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
});
