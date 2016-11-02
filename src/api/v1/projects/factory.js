angular.module('oi.api').factory('oiApiV1ProjectsObjectFactory', function ($q, $log, oiApiV1SchemaBase, oiApiV1SchemaObjectFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaObjectFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1ProjectObjectFactory = function(args) {
    SUPER.call(this, args);

    this.isProject = true; // to distinguish from system-schema!

    oiApiV1SchemaBase.create(this);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1ProjectObjectFactory, SUPER);
  angular.extend(proto, oiApiV1SchemaBase.proto);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    return oiApiV1SchemaBase.init(this);
  });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
 
  proto.getProject = function(uuid) {
    return this.up.read().then(function(list) {
      var len = list ? list.length : undefined;
      if (!len) { return $q.reject(); }

      for (var i = 0; i < len; i++) {
        var pro = list[i];
        if (pro.uuid === uuid) { return pro; }
      }

      return $q.reject();
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1ProjectObjectFactory;
});
