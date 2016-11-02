angular.module('oi.model').factory('oiModelFactory', function ($q, $log, oiModel, oiModelBaseFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.getProject = function(uuid) {
    return this.getModel('Project', uuid);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelFactory;
});
