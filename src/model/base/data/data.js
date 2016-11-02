angular.module('oi.model').factory('oiModelBaseDataFactory', function ($q, $log, oiUtilProtoBuild) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelBaseDataFactory = function(base, args) {
    angular.extend(this, base);

    this.__base = base;

    if ('up' in args) { this.up = args.up; }
  };

  var proto = oiModelBaseDataFactory.prototype;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var def = this.definition.initData;
    if (angular.isObject(def)) { this.__defData = def; }

    return this.initData(true);
  });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.cloneBase = function() {
    var base = angular.extend({}, this.__base);

    delete(base.init);
    delete(base.data);

    delete(base.up);

    delete(base.__defData);
    
    return base;
  };

  proto.clone = function(args) {
    var base      = this.cloneBase();
        base.data = this.copyData();

    if (!angular.isObject(args)) { args = {}; }

    return new this.constructor(base, args);
  };

  proto.temp = function() { 
    var model = this.definition.model.key;
    var data  = this.copyData();

    return this.__model.buildTypeTemp(model, data);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.buildObject = function() { 
    return this.__model.buildTypeData.apply(this.__model, arguments); 
  };

  proto.initData = function(init) {
    var def = this.__defData;
    if (!def) { return; }

    return this.instantiateObjects();
  };

  /* ------------------------------------------------------------------ */

  var _inst_obj = function(that, model, val, wait) {
    var obj;

    if (val instanceof oiModelBaseDataFactory) {
      obj = val;

    } else {
      obj = that.buildObject(model, val);
    }

    obj.up = that;

    wait.push(obj.init());

    return obj;
  };

  proto.instantiateObjects = function(data) {
    var def = this.__defData;
    if (!def) { return; }

    var wait = [];

    if (!angular.isObject(data)) { data = this.data; }

    for (var key in def) {
      if (key in data) {
        var model = def[key],
              val = data[key];

        if (angular.isArray(val)) {
          for (var i in val) {
            val[i] = _inst_obj(this, model, val[i], wait);
          }

        } else {
          data[key] = _inst_obj(this, model, val, wait);
        }
      }
    }

    if (!wait.length) { return; }

    return $q.all(wait);
  };

  var _enum_obj = function(that, obj, fn) {
    if (obj instanceof oiModelBaseDataFactory) {
      fn.call(that, obj);
    }
  };

  proto.enumerateObjects = function(data, fn) {
    var def = this.__defData;
    if (!def) { return; }

    if (typeof(data) === 'function') {
      fn   = data;
      data = this.data;

    } else {
      if (typeof(fn) !== 'function') { return; }
      if (!angular.isObject(data)) { data = this.data; }
    }

    for (var key in def) {
      if (key in data) {
        var val = data[key];

        if (angular.isArray(val)) {
          for (var i in val) {
            _enum_obj(this, val[i], fn);
          }

        } else {
          _enum_obj(this, val, fn);
        }
      }
    }
  };


  /* ------------------------------------------------------------------ */

  var _copy_obj = function(that, obj, fn) {
    if (obj instanceof oiModelBaseDataFactory) {
      return fn ? fn.call(that, obj) : obj.copyData();

    } else {
      return angular.copy(obj);
    }
  };

  var _copy_with_objs = function(that, data, def, objs, fn) {
    var copy = {};

    for (var key in data) {
      var val = data[key];

      if (key in def) {
        if (objs) {
          if (angular.isArray(val)) {
            var list = copy[key] = [];

            for (var i in val) {
              list[i] = _copy_obj(that, val[i], fn);
            }

          } else {
            copy[key] = _copy_obj(that, val, fn);
          }
        }

      } else {
        copy[key] = angular.copy(val);
      }
    }

    return copy; 
  };

  var _copy_data = function(that, data, objs, fn) {
    var def  = that.__defData;
    var copy = def ? _copy_with_objs(that, data, def, objs, fn) : angular.copy(data);

    that.manipulateCopy(copy);

    return copy;
  };

  proto.copyWithReplace = function(data, fn) {
    if (typeof(data) === 'function') {
      fn   = data;
      data = this.data;

    } else {
      if (typeof(fn) !== 'function') { return; }
      if (!angular.isObject(data)) { data = this.data; }
    }

    return _copy_data(this, data, true, fn);
  };

  // .copyData([ <ds> ][ withObjects ]);

  proto.copyData = function(data, all) { 
    if (typeof(data) === 'boolean') {
       data = undefined;
       all  = data;
    }
 
    if (!angular.isObject(data)) { data = this.data; }
    if (all !== false) { all = true; }

    return _copy_data(this, data, all);
  };

  proto.manipulateCopy = function(copy) {};


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseDataFactory;
});
