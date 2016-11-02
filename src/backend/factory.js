angular.module('oi.backend').factory('oiBackendFactory', function ($http, $q, $log, oiBackendRestFactory, oiBackendCacheFactory, oiBackendSessionFactory, oiBackendApi, oiModelFactory, oiModel) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiBackendFactory = function(config) {
    if (!angular.isObject(config)) { config = {}; }
    this.config = config;
  };

  var proto = oiBackendFactory.prototype;

  /* ------------------------------------------------------------------ */

  proto.init = function() {
    var config = this.config;

    var base = this.base = config.base || config.url;
    if (!base) { return $q.reject({ reason : 'no backend url found' }); }

    var that = this;

    return $http.get(base+'/version').then(function(get) {
      var vers = get.data;
      if (!vers.match(/^2\./)) { return $q.reject({ reason : 'unknown backend version' }); }

      that.version = vers;

      var rest = that.rest  = new oiBackendRestFactory({ url : base+'/rest' });
                 that.cache = new oiBackendCacheFactory({ rest : rest });

      var api  = that.api   = oiBackendApi.create({ backend : that });
      var av1  = that.v1    = api.util('v1');

      var wapp = that.webapp = av1.object('webapp', config.appIdent);

      that.model = new oiModelFactory({ definition : oiModel, api : av1, webapp : wapp });

      var sess = that.session = new oiBackendSessionFactory({
        base  : base, 
        guest : [ 'anonymous', 'anonymous' ] // TODO: configure (webapp?)
      });

      var clear_caches = function() { that.clearCaches(); };

      return sess.init().then(function() { 
        sess.on('logged_out', clear_caches);
        sess.on('logged_in',  clear_caches);

        return that;
      });
    });
  };

  proto.clearCaches = function() {
    this.cache.clear();
    this.model.clearCache();
  };

  proto.projects = function() {
    return this.v1.util('projects').read();
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiBackendFactory;
});
