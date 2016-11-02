angular.module('oi.model').provider('oiModel', function () {
  'use strict';

  var MODELS = {}, MTYPES = {};

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _type_base = function(keys, key) {
    var def = keys['default'];
    if (key === 'default') { return def; }

    var segs = key.split('.');
    var seg  = segs.shift();

    while (seg) {
      def = def.DOWN[seg] || (def.DOWN[seg] = { DOWN : {}, UP : def });
      seg = segs.shift();
    }

    keys[key] = def;

    return def;
  };

  var _type_templates_for_key = function(key, def, up) {
    if (!up) { return def[key]; }
    return angular.extend({}, up[key], def[key]);
  };

  var _type_templates = function(def, up) {
    var tpls = {};
    var pres = [ 'data', 'temp', 'list' ];

    for (var i in pres) {
      var pre = pres[i];
      var key = pre+'Templates';

      tpls[key] = _type_templates_for_key(key, def, up);
    }

    return tpls;
  };

  var _compile_type = function(keys, key, def) {
    var base = _type_base(keys, key);
    var tpls = _type_templates(def, base.UP);
    
    angular.extend(base, base.UP, { label : key }, def, tpls, { type : key });

    return base;
  };

  var _compile_types = function(model, mdef) {
    var defs = MTYPES[model] || {};
    if (!defs) { return {}; }

    var type = { 'default' : { DOWN : {} } };

    if ('default' in defs) {
      var d = type['default'] = _compile_type(type, 'default', defs['default']);
      delete(defs['default']);

      if (mdef) {
        d.model = mdef;
      }
    }

    var keys = Object.keys(defs);
        keys.sort();

    var klen = keys.length;
    for (var i = 0; i < klen; i++) {
      var key = keys[i];
      var def = defs[key];

      type[key] = _compile_type(type, key, def);
    }

    return type;
  };

  /* ------------------------------------------------------------------ */
  /* -- model defs ---------------------------------------------------- */
  /* ------------------------------------------------------------------ */

  var _model_base = function(def, segs) {
    if (!angular.isArray(segs)) { segs = segs.split('/'); }

    var len = segs.length;
    if (!len) { return def; }

    for (var i = 0; i < len; i++) {
      var seg = segs[i];
          def = def.DOWN[seg] || (def.DOWN[seg] = { DOWN : {}, UP : def });
    }

    return def;
  };

  var _model_def = function(key) {
    var def = MODELS[key] || {};

    if ('extends' in def) {
      def = angular.extend({}, _model_def(def['extends']), def);
    }
 
    return def;
  };

  var _compile_model = function(defs, key) {
    var segs = key.split('/');
    var base = _model_base(defs, segs);

    angular.extend(base, _model_def(key));
 
    base.KEY = key;
    base.key = segs[segs.length-1];
    
    if ('alias' in base) {
      base.UP.DOWN[base.alias] = base;
    }

    if ('extends' in base) {
      base.EXTENDS = _model_base(defs, base['extends']);
    }

    base.TYPES = _compile_types(key, base);
  };

  var _merge_down = function(def) {
    var ext = def.EXTENDS;

    if (ext.EXTENDS) { _merge_down(ext); }
 
    var ext_DOWN = ext.DOWN,
        def_DOWN = def.DOWN;

    for (var key in ext_DOWN) {
      if (!(key in def_DOWN)) {
        def_DOWN[key] = ext_DOWN[key];
      }
    }

    delete(def.EXTENDS);
  };

  var _merge_extend_down = function(defs) {
    for (var key in defs) {
      var def = defs[key];

      if ('EXTENDS' in def) {
        _merge_down(def);
      }

      _merge_extend_down(def.DOWN);
    }
  };

  var _compile_defs = function() {
    var mods = angular.extend({}, MTYPES, MODELS);
    var keys = Object.keys(mods);
        keys.sort();

    var defs = { DOWN : {} };

    for (var i in keys) {
      _compile_model(defs, keys[i]);
    }

    _merge_extend_down(defs.DOWN);

    return defs;
  };

  var _define_type = function(type, key, def) {
    var T = MTYPES[type] || (MTYPES[type] = {});
        T[key] = def;
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  return {
    defineModel : function(model, def) { 
      MODELS[model] = def;
    },

    defineModelType : function(model, type, def) {
      if (typeof(model) !== 'string') { return; }

      if (angular.isObject(type)) {
        for (var t in type) {
          def = type[t];
          if (t && angular.isObject(def)) { _define_type(model, t, def); }
        }

      } else {
        if (typeof(type) !== 'string') { return; }
        if (type && angular.isObject(def)) { _define_type(model, type, def); }
      }
    },


    // ----------------------------------------------------------------
    // -- returned as service -----------------------------------------
    // ----------------------------------------------------------------

    $get : function(oiUtilObjectCacheFactory) {
      return _compile_defs();
    }
  };
});
