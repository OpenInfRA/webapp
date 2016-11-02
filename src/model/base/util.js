angular.module('oi.model').factory('oiModelBaseUtilFactory', function ($q, $log, oiUtilProtoBuild) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelBaseUtilFactory = function(base, args) {
    angular.extend(this, base);

    if (!this.api && args.api) {
      var util = this.definition.utilApi;
      if (util) { this.api = args.api.util(util); }
    }
  };

  var proto = oiModelBaseUtilFactory.prototype;

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() { });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataRead = function(id, full) {
    if (!this.api) { return $q.reject(); }
    return this.api.dataRead(id, full);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseUtilFactory;
});
