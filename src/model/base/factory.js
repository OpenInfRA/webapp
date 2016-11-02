angular.module('oi.model').factory('oiModelBaseFactory', function ($q, $log, oiUtilObject, oiUtilObjectCacheFactory, oiUtilProtoBuild) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _get_model = function(that, def, uuid) {
    var key = def.KEY+':'+uuid;
    return that.__MODEL.__CACHE.get(key, [ def, uuid ], that);
  };

  /* ------------------------------------------------------------------ */

  var _get_cache = function(that, key, create) { 
    var cache = that[key] || (that[key] = new oiUtilObjectCacheFactory({ create : create }));
    return cache;
  };
 
  var _create_model_util, _create_type_util;

  var _get_model_util = function(that, def) {
    var key = def.key;
    return _get_cache(that, '__MUTIL', _create_model_util).get(key, [ def ], that);
  };

  var _get_type_util = function(that, def) {
    var key = def.model.key+':'+def.type;
    return _get_cache(that, '__TUTIL', _create_type_util).get(key, [ def ], that);
  };

  /* ------------------------------------------------------------------ */

  var _factory = function(name, infix) {
    if (name.substring(0,2) === 'oi') { return name; }
    if (!infix) { infix = ''; }

    return 'oiModel'+name+infix+'Factory';
  };

  var _full_name = function(def) {
    var pre = def.UP ? _full_name(def.UP) : '';
    return pre + (def.alias || def.key || '');
  };

  var _factory_full = function(def, infix) {
    var name = _full_name(def);
    return 'oiModel' + name + (infix ? infix : '') + 'Factory';
  };

  var _create_model = function(def, uuid) {
    var that = this;

    var fac  = _factory_full(def);
    var base = { definition : def, uuid : uuid };

    that.extendModelBase(base);

    var util = _get_model_util(that, def);
    if (util) { base.util = util; }

    base.model   = that;
    base.__UP    = that;
    base.__MODEL = that.__MODEL;

    return [ fac , base, { api : that.api } ];
  };

  _create_model_util = function(def) {
    var that = this;

    var fac = def.utilFactory;

    if (fac === true) {
      fac = _factory_full(def, 'Util');

    } else if (typeof(fac) !== 'string') {
      return;
    }

    var base = { definition : def };

    that.extendModelBase(base);

    base.model = that;

    return [ fac, base, { api : that.api } ];
  };

  _create_type_util = function(def) {
    var that = this;

    var name = def.utilFactory || 'Base';
    var post = 'Data';
    if (def.model.configOf) { post += 'Conf'; }

    var fac  = _factory(name, post+'Util');
    var base = { definition : def, __model : that };

    return [ fac, base ];
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */


  var oiModelBaseFactory = function(base, args) {
    angular.extend(this, base);

    if (!this.__MODEL) { 
      this.__MODEL = this.model = this;
      this.__CACHE = new oiUtilObjectCacheFactory({ create : _create_model });
    }

    this.__CTYPES = {};
    this.__CONFS  = {};
  };

  var proto = oiModelBaseFactory.prototype;

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() { });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.extendModelBase = function(base) { 
    base.webapp = this.webapp;
  };

  proto.extendTypeBase = function(base) {};


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _model_def = function(that, model) {
    if (typeof(model) !== 'string') { return; }
    return that.definition.DOWN[model];
  };

  proto.getModel = function(model, uuid) {
    var def = _model_def(this, model);
    if (!def) { return; }

    if (typeof(uuid) !== 'string') { return; }

    return _get_model(this, def, uuid);
  };

  proto.getModelUtil = function(model) {
    var def = _model_def(this, model);
    if (!def) { return; }

    return _get_model_util(this, def);
  };

  proto.clearCache = function() { 
    var M = this.__MODEL;
    M.__CACHE.clear(); 
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.registerConfigurations = function(confs) {
    if (!angular.isObject(confs)) { return; }
    angular.extend(this.__CONFS, confs);
  };

  proto.registerCustomTypes = function(types) {
    if (!angular.isObject(types)) { return; }
    angular.extend(this.__CTYPES, types);
  };

  proto.getCustomType = function(uuid) {
    return this.__CTYPES[uuid];
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _custom_conf = function(that, uuid) { return that.__CONFS[uuid]; };

  var __custom_type = function(that, mdef, uuid, data) {
    var type = that.__CTYPES[uuid];
    if (type) { return type; }

    var fn = mdef.customType; // ensure in provider that this is a function!
    if (fn) { return fn.call(that, data); }

    return;
  };

  var _custom_type = function(that, mdef, uuid, data, conf) {
    return conf.modelType || __custom_type(that, mdef, uuid, data) || 'default';
  };

  var __custom_base = function(that, base, mdef, uuid, data) {
    var conf = _custom_conf(that, uuid) || {};
    var type = _custom_type(that, mdef, uuid, data, conf);

    base.type          = type;
    base.configuration = conf;
  };

  var _custom_base_conf = function(that, base, mdef, uuid, data) {
    // explicit configuration in data is preferred

    var conf = data.configuration;
    if (!conf) { return __custom_base(that, base, mdef, uuid, data); }

    base.configuration = {};
    base.type          = _custom_type(that, mdef, uuid, data, conf);
  };

  var _custom_base_inst = function(that, base, mdef, uuid, data) {
    // create base based on config model

    data = data[mdef.configData];
    uuid = data.uuid;

    mdef = _model_def(that, mdef.instanceOf);

    __custom_base(that, base, mdef, uuid, data);
  };

  var _extend_def_util = function(that, mdef, base) {
    var type = base.type || 'default';
    if (!type) { return; }

    var tdef = mdef.TYPES[type];
    if (tdef) {
      base.definition = tdef;
      base.util       = _get_type_util(that, tdef);
    }
  };

  var _custom_type_base = function(that, mdef, uuid, data) {
    var base = { uuid : uuid, data : data };

    if (mdef.configOf) {
      // type and optionally (compiled) configuration (if not data.configuration!)
      _custom_base_conf(that, base, mdef, uuid, data);

    } else if (mdef.instanceOf) {
      // type and (compiled) configuration auf ConfigModel
      _custom_base_inst(that, base, mdef, uuid, data);
    }

    _extend_def_util(that, mdef, base);

    return base;
  };

  var _type_factory_key = function(infix) {
    if (infix === 'Temp') { return 'tempFactory'; }
    return 'dataFactory';
  };

  var _type_factory = function(mdef, tdef, infix) {
    var key = _type_factory_key(infix);
    var fac = tdef[key] || 'Base';

    var post = 'Data';
    if (mdef.configOf) { post += 'Conf'; }

    if (!infix) { infix = ''; }

    return _factory(fac, post+infix);
  };

  var __build_type_data = function(that, mdef, data, infix) {
    var uuid = data.uuid;
    var base = _custom_type_base(that, mdef, uuid, data);

    var tdef = base.definition;
    var fac  = _type_factory(mdef, tdef, infix);

    that.extendTypeBase(base);

    base.__model = that;

    return oiUtilObject.create(fac, base);
  };


  /* ------------------------------------------------------------------ */

  var _build_type_data = function(that, model, data, infix) {
    var def = _model_def(that, model);
    if (!def) { return; }

    if (!angular.isObject(data)) { return; }

    return __build_type_data(that, def, data, infix);
  };

  proto.buildTypeData = function(model, data) {
    return _build_type_data(this, model, data);
  };

  proto.buildTypeTemp = function(model, data) {
    return _build_type_data(this, model, data, 'Temp');
  };

  var _load_type_data = function(that, model, uuid, full, infix) {
    var def = _model_def(that, model);
    if (!def) { return $q.reject(); }

    var util = _get_model_util(that, def);
    if (!util) { return $q.reject(); }

    return util.dataRead(uuid, full).then(function(data) {
      return __build_type_data(that, def, data, infix);
    });
  };

  proto.loadTypeData = function(model, uuid, full) {
    return _load_type_data(this, model, uuid, full);
  };

  proto.loadTypeTemp = function(model, uuid, full) {
    return _load_type_data(this, model, uuid, full, 'Temp');
  };

  /* ------------------------------------------------------------------ */

  var _copy_loaded_data = function(that) {
    var data;

    try { data = that.loaded.data; } catch(e) {}
    if (!data) { return; }
  
    return angular.copy(data);
  };

  proto.typeData = function() { 
    var data = _copy_loaded_data(this);
    if (!data) { return; }

    return this.model.buildTypeData(this.definition.key, data);
  };

  proto.typeTemp = function() { 
    var data = _copy_loaded_data(this);
    return this.model.buildTypeTemp(this.definition.key, data);
  };

  /* ------------------------------------------------------------------ */

  proto.buildTypeList = function(model, args) {
    var mdef = _model_def(this, model);
    if (!mdef) { return; }

    var base = angular.extend({}, args);

    _extend_def_util(this, mdef, base);

    this.extendTypeBase(base);

    base.__model = this;

    var tdef = base.definition;
    var fac  = _type_factory(mdef, tdef, 'List');

    return oiUtilObject.create(fac, base);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataUpdate = function(data) {
    if (!data) { return $q.resolve(); }

    if (typeof(data.copyData) === 'function') { data = data.copyData(); }

    var that = this;

    return this.api.dataUpdate(data).then(function() {
      if (!that.loaded.data) { return; }

      return that.load(true).then(function() { return; });
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseFactory;
});
