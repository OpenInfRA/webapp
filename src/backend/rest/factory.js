angular.module('oi.backend').factory('oiBackendRestFactory', function ($http, oiUtilUrl, oiUtilProtoBuildEnumerate) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiBackendRestFactory = function(args) {
    this.URL = args.url;
  };

  var proto = oiBackendRestFactory.prototype;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _api = function(api) {
    return (typeof(api) === 'string') ? api : oiUtilUrl.joinURL(api);
  };

  var _url = function(that, api) {
    return that.URL+'/'+_api(api)+'.json';
  };
 
  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.post = function(api, data) {
    return $http.post(_url(this, api), data).then(function(res) {
      return res.data;
    });
  };

  proto.put = function(api, data) {
    return $http.put(_url(this, api), data).then(function(res) {
      return res.data;
    });
  };

  proto['delete'] = function(api) {
    return $http['delete'](_url(this, api)).then(function(res) {
      return res.data;
    });
  };

  proto.get = function(api, params) {
    var opts = {};
    if (params) { opts.params = params; }

    return $http.get(_url(this, api), opts).then(function(res) {
      return res.data;
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.count = function(api, params) {
    return $http.get(this.URL+'/'+_api(api)+'/count').then(function(res) {
      return parseInt(res.data, 10);
    });
  };


  /* ------------------------------------------------------------------ */
  /* .all(seg+, query?);
  /* .enumerate(seg+, query?, fn(date));
  /* ------------------------------------------------------------------ */

  var _enum_get = function(url, query) { return this.get(url, query); };

  proto.all       = oiUtilProtoBuildEnumerate.buildAll({       max : 50, get : _enum_get });
  proto.enumerate = oiUtilProtoBuildEnumerate.buildEnumerate({ max : 50, get : _enum_get });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiBackendRestFactory;
});
