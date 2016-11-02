angular.module('oi.util').service('oiUtilLocalize', function ($rootScope, $translate, $log) {
  'use strict';

  var that = this;

  var LOCALE  = 'de';
  var LOCALES = [ 'de', 'en' ];

  var RFN = {};
  var SCO = {};

  this.current = function() { return LOCALE;  };
  this.locales = function() { return LOCALES; };

  /* translate key with current locale (and opt arguments) */

  this.translate = function(string, args) {
    return $translate.instant(string, args);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  /* pick string for current locale from rest-api-localizedStrings (with fallback) */

  var _simplify_strings = function(localized) {
    if (!angular.isArray(localized) || (localized.length === 0)) { return; }

    var simplified = {};

    angular.forEach(localized, function(string) {
      simplified[string.locale.languageCode] = string.characterString;
    });

    return simplified;
  };

  this.localize = function(strings) {
    if (typeof(strings) === 'string') { return strings; }

    if (angular.isArray(strings)) {
      strings = _simplify_strings(strings);

    } else if (!angular.isObject(strings)) {
      return;

    } else if (strings.localizedStrings) {
      strings = _simplify_strings(strings.localizedStrings);
    }

    if (!strings) { return '<missing>'; }

    if ('xx'   in strings) { return strings.xx; }
    if (LOCALE in strings) { return strings[LOCALE]; }

    for (var i = 0; i < LOCALES.length; i++) {
      var locale = LOCALES[i];
      if (locale in strings) { return strings[locale] +' ['+locale+']'; }
    }

    return  '<missing>';
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var RID = 0;

  this.changed = function(scope, fn, cont) {
    if (typeof(scope) === 'function') {
      fn     = scope;
      scope = null;

    } else if (typeof(fn) !== 'function') { 
      return; 
    }

    var rid = RID++;
    RFN[rid] = [ fn, cont ];

    if (scope) {
      scope.$on('$destroy', function() {
        delete(RFN[rid]);
      });
    }
  };

  /* ------------------------------------------------------------------ */
 
  var _scope = function(scope, create) {
    var sid = scope.$id;
    var sco = SCO[sid];

    if (!sco && create) {
      sco = SCO[sid] = [ 0, {},
        scope.$on('$destroy', function() { delete(SCO[sid]); }) 
      ];
    }

    return sco;
  };

  var _register_elem = function(value, elem, uuid, scope) {
    var sco = _scope(scope, true);
    var els = sco[1];

    var el  = els[uuid];

    if (el) {
      el[1] = value;

    } else {
      el = els[uuid] = [ elem, value ];
      sco[0]++;
    } 
  };

  var _unregister_elem = function(uuid, scope) {
    var sco = _scope(scope);
    if (!sco) { return; }

    var els = sco[1];

    var el = els[uuid];
    if (!el) { return; }

    sco[0]--;

    if (!sco[0]) {
      // all former registered elements in the scope
      // have been unregistered, we can unregister the scope
 
      delete(SCO[scope.$id]);
      sco[2]();
    }
  };

  var _localize_element = function(el) {
    el[0].text(that.localize(el[1]));
  };

  var _localize_scope = function(sco) {
    angular.forEach(sco[1], _localize_element);
  };

  this.element = function(value, elem, uuid, scope) {
    if (!uuid) { return; }

    if (angular.isArray(value) || angular.isObject(value)) {
      elem.text(that.localize(value));
      _register_elem(value, elem, uuid, scope);

    } else {
      elem.text(value);
      _unregister_elem(uuid, scope);
    }
  };

  /* ------------------------------------------------------------------ */

  this.use = function(locale) {
    $translate.use(locale).then(function(data) {
      if (data !== locale) { return; }

      LOCALE = locale;

      angular.forEach(RFN, function(rfn) { rfn[0].call(rfn[1], locale); });
      angular.forEach(SCO, _localize_scope);
    });
  };

});
