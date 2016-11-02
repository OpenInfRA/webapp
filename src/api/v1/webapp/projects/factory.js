angular.module('oi.api').factory('oiApiV1WebAppProjectsUtilFactory', function ($q, $log, oiBackendCrudUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiBackendCrudUtilFactory,
      SUPER_read   = SUPER.prototype.read,
      SUPER_update = SUPER.prototype.update;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1WebAppProjectsUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1WebAppProjectsUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.read = function(id) {
    return SUPER_read.call(this, id).then(function(data) {
      return angular.fromJson(data.data);
    });
  };

  var _update_into = function(that, data, into) {
    if (angular.isObject(data)) {
      angular.extend(into, data);

    } else if (typeof(data) === 'function') {
      return data.call(that, into);
    }
  };

  proto.update = function(id, data) {
    var that = this;

    return SUPER_update.call(this, id, function(into) {
      var base = angular.fromJson(into.data),
          wait = _update_into(that, data, base);
       
      return $q.when(wait).then(function() {
        into.data = angular.toJson(base);
      });
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1WebAppProjectsUtilFactory;
});
