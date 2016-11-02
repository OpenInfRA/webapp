angular.module('oi.model').factory('oiModelProjectFactory', function ($q, $log, oiModelSchemaFactory, oiUtilProtoBuild) {

  'use strict';

  var SUPER = oiModelSchemaFactory,
      SUPER_init = SUPER.prototype.init;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelProjectFactory = function(base, args) {
    SUPER.call(this, base, args);

    if (!this.api && args.api) {
      this.api = args.api.object('projects', this.uuid);
    }

    this.isProject = true;
    this.webappPro = this.webapp.object('projects', this.uuid);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelProjectFactory, SUPER);

  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var that = this;

    return $q.when(SUPER_init.call(this)).then(function() {
      return that.load();
    });
  });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _menu_topchars = function(meta, hash) {
    var list = [];

    var menu_tc = meta.menuTopicCharacteristics || meta.menu_tc;
    if (!menu_tc) { return list; }

    for (var i in menu_tc) {
      var uuid = menu_tc[i];
      list.push( hash[uuid] );
    }

    return list;
  };

  proto.load = function() {
    var that = this;
    var api  = this.api;

    return $q.all({
      get      : api.getProject(that.uuid), // api.read() cant be used (backend BUG!)
      meta     : api.metadata()
 
    }).then(function(load) {
      that.loaded  = load;
      that.menu_tc = _menu_topchars(load.meta, that.topchars);

      return load;
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelProjectFactory;
});
