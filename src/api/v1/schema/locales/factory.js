angular.module('oi.api').factory('oiApiV1SchemaLocalesFactory', function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1LocalesFactory = function(base, args) {
    angular.extend(this, base);

    this.locales = this.api.locales;
    this.locale  = this.locales[0].code;
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1LocalesFactory;
});
