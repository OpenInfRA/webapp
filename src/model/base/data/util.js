angular.module('oi.model').factory('oiModelBaseDataUtilFactory', function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelBaseDataUtilFactory = function(base) {
    angular.extend(this, base);
    // this.definition via base
  };

  // var proto = oiModelBaseDataUtilFactory.prototype;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseDataUtilFactory;
});
