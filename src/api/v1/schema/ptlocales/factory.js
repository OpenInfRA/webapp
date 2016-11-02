angular.module('oi.api').factory('oiApiV1SchemaPTLocalesUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaPTLocalesUtilFactory = function(args) {
    SUPER.call(this, args);
  
    this.locale  = {};
    this.locales = [];
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaPTLocalesUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var LOC  = this.locale  = {};
    var LOCS = this.locales = [];
    var that = this;

    return this.cache.enumerate(this.path, function(locale) {
      var uuid = locale.uuid;

      var code = locale.languageCode;
      // if (locale.countryCode) { code += '_'+locale.countryCode; }

      var loc = {
        code   : code,
        uuid   : uuid,
        label  : locale.languageCode,
        locale : locale
      };

      LOC[code] = LOC[uuid] = loc;

      if (code === 'xx') { 
        that.xx     = uuid;
        that.xx_loc = locale;

      } else {
        LOCS.push(loc);
      }

    }).then(function() {
      LOCS.sort(function(a, b) { return +(a.code > b.code) || +(a.code === b.code) - 1; }); 
    });
  });

  proto.get = function(key) { return this.locales[key]; };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaPTLocalesUtilFactory;
});
