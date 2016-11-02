angular.module('oi.api').factory('oiApiV1SchemaPTFreeTextUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaPTLocalesUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaPTLocalesUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var that = this;
    var ptl  = this.shared.ptlocales;

    return ptl.init().then(function() {
      that.ptl_locale = ptl.locale;
      that.ptl_xx     = ptl.xx;
      that.ptl_xx_loc = ptl.xx_loc;
    });
  });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _create_localized = function(that, ds) {
    if (!ds) { return null; }

    if (ds.uuid) { return ds; }
  
    return that.rest.post(that.path, ds).then(function(ds) {
      return that.rest.get([ that.path, ds.uuid ]);
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _simplify_localized = function(ds, locale) {
    if (!angular.isObject(ds)) { return; }

    var localized = ds.localizedStrings;
    if (!localized) { return; }

    var strings = {};

    for (var i in localized) {
      var str = localized[i];
      var loc = locale[str.locale.uuid];

      if (loc) { strings[loc.code] = str.characterString; }
    }

    return strings;
  };

  proto.simplifyLocalized = function(ds) {
    return _simplify_localized(ds, this.ptl_locale);
  };


  /* ------------------------------------------------------------------ */

  var _clean_up_strings = function(strings) {
    for (var code in strings) {
      var str = strings[code];
      if (!str.length) { delete(strings[code]); }
    }
  };

  var _same_localized = function(strings, old, locs) {
    old = _simplify_localized(old, locs);
    if (!old) { return false; }

    return angular.equals(strings, old);
  };

  var _build_localized = function(that, strings, old) {
    var locale = that.ptl_locale;

    _clean_up_strings(strings);

    if (old && _same_localized(strings, old, locale)) { return old; }

    var lstrings = [];

    for (var code in strings) {
      lstrings.push({
        characterString : strings[code],
        locale          : locale[code].locale
      });
    }

    return { localizedStrings : lstrings };
  };

  proto.buildLocalized = function(strings, old) {
    if (!angular.isObject(strings)) { return null; }

    return _build_localized(this, strings, old);
  };

  proto.createLocalized = function(strings, old) {
    if (!angular.isObject(strings)) { return null; }

    var localized = _build_localized(this, strings, old);

    return _create_localized(this, localized);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.simpleString = function(ds) {
    var localized = ds.localizedStrings;
    if (!localized) { return; }

    var xx  = this.ptl_xx;
    var len = localized.length;

    for (var i = 0; i < len; i++) {
      var str = localized[i];
      if (str.locale.uuid === xx) { return str.characterString; }
    }

    return;
  };


  /* ------------------------------------------------------------------ */

  var _same_simple = function(string, old, xx) {
    if (!angular.isObject(old)) { return; }

    var localized = old.localizedStrings;
    if (!localized) { return; }
    
    if (localized.length !== 1) { return false; }

    var str = localized[0];
   
    if (str.locale.uuid     !== xx)     { return false; }
    if (str.characterString !== string) { return false; }

    return true;
  };

  var _build_simple = function(that, string, old) {
    if (old && _same_simple(string, old, that.ptl_xx)) { return old; }

    var lstrings = [{ 
      characterString : string,
      locale          : that.ptl_xx_loc
    }];

    return { localizedStrings : lstrings };
  };

  proto.buildSimple = function(string, old) { // just the structure
    if (typeof(string) !== 'string') { return null; }

    return _build_simple(this, string, old);
  };

  proto.createSimple = function(string, old) { // creates with promise if necessary
    if (typeof(string) !== 'string') { return null; }

    var localized = _build_simple(this, string, old);

    return _create_localized(this, localized);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaPTLocalesUtilFactory;
});
