angular.module('oi.model').factory('oiModelBaseDataTempFactory', function ($q, $log, oiModelBaseDataFactory, oiUtilProtoBuild) {
  'use strict';

  var UNIQ = 1;


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var SUPER = oiModelBaseDataFactory,
      SUPER_initData  = SUPER.prototype.initData,
      SUPER_cloneBase = SUPER.prototype.cloneBase;


  var oiModelBaseDataTempFactory = function(base, args) {
    SUPER.call(this, base, args);

    if (this.schema) {
      this.locales = this.schema.locales();
    }

    this.__uniq = UNIQ++;

    this.$dirty = false;
    this.$DIRTY = false;
  };

  var proto = oiUtilProtoBuild.inherit(oiModelBaseDataTempFactory, SUPER);


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.initData = function(init) {
    var ret = SUPER_initData.call(this, init);

    if (init) {
      this.__DATA = this.copyData(); 	 // for reset
      this.__data = this.copyWithUniq(); // for dirty checks

    } else {
      this.calcDirty(); 
    }

    return ret;
  };


  /* ------------------------------------------------------------------ */

  proto.cloneBase = function() {
    var base = SUPER_cloneBase.call(this);

    delete(base.__uniq);

    delete(base.$dirty);
    delete(base.$DIRTY);

    delete(base.__DATA);
    delete(base.__data);

    return base;
  };

  proto.clone = function(args) {
    if (!angular.isObject(args)) { args = {}; }

    var base =      this.cloneBase();
        base.data = this.copyWithClones();

    var clone = new this.constructor(base, args);
        clone.__uniq = this.__uniq;

    return clone;
  };


  /* ------------------------------------------------------------------ */

  proto.buildObject = function() { 
    return this.__model.buildTypeTemp.apply(this.__model, arguments); 
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _rep_obj = function(that, obj, fn) {
    if (obj instanceof oiModelBaseDataTempFactory) {
      return fn.call(that, obj);

    } else {
      return obj;
    }
  };

  proto.replaceObjects = function(data, fn) {
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
            val[i] = _rep_obj(this, val[i], fn);
          }

        } else {
          data[key] = _rep_obj(this, val, fn);
        }
      }
    }
  };

  proto.replaceWithUniq = function(data) {
    return this.replaceObjects(data, function(obj) {
      return obj.__uniq;
    });
  };

  proto.copyWithUniq = function(data) {
    return this.copyWithReplace(data, function(obj) {
      return obj.__uniq;
    });
  };

  proto.copyWithClones = function(data) {
    return this.copyWithReplace(data, function(obj) {
      var clone = obj.clone();
          clone.init();

      return clone;
    });
  };



  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _dirty_child = function(that) {
    var def = that.__defData;
    if (!def) { return false; }

    var data = that.data;

    for (var key in def) {
      var objs = data[key];

      if (angular.isArray(objs)) {
        for (var i in objs) {
          var obj = objs[i];
          if (obj.$dirty) { return true; }
        }

      } else {
        if (objs.$dirty) { return true; }
      }
    }

    return false;
  };

  var _calc_DIRTY = function(that, data) {
    data = that.copyWithUniq(data); // always get a copy, for manipulate effects!

    var __data = that.__data;

    var $dirty = that.$DIRTY = (__data && (angular.equals(__data, data))) ? false : true;

    return $dirty;
  };

  var _calc_dirty = function(that, data, full) {
    var old = that.$dirty,
        $dirty;

    if (full === false) {
      if (that.$DIRTY) { return; }

      $dirty = _dirty_child(that);

    } else {
      $dirty = _calc_DIRTY(that, data) || _dirty_child(that);
    }

    if (old === $dirty) { return $dirty; }

    that.$dirty = $dirty;

    var up = that.up;
    if (!up) { return $dirty; }

    if ($dirty) {
      while (up) {
        up.$dirty = true;
        up = up.up;
      }

    } else {
      _calc_dirty(up, up.data, false);
    }

    return $dirty;
  };

  proto.calcDirty = function(full) { return _calc_dirty(this, this.data, full); };


  /* ------------------------------------------------------------------ */

  var _merge_clone = function(that, clone) {
    // create lookup for all old objects

    var objs = {};

    that.enumerateObjects(function(obj) {
      objs[obj.__uniq] = obj;
    });

    var data = clone.copyWithClones();

    // replace all (known) clones with original objects

    that.replaceObjects(data, function(obj) {
      var old = objs[obj.__uniq];
      if (!old) { return obj; }
      
      old.setData(obj);

      $log.log('old', old);
  
      return old;
    });

    return data;
  };

  proto.setData = function(data) {
    if (!data) { return; }

    if ((data instanceof oiModelBaseDataTempFactory) && (data.__uniq === this.__uniq)) {
      this.data = _merge_clone(this, data);

    } else {
      this.data = this.copyData(data);
    }

    return this.initData(); 
  };

  proto.resetData = function() {
    if (!this.$dirty) { return; }

    this.data = angular.copy(this.__DATA);

    return this.initData();
  };


  /* ------------------------------------------------------------------ */

  proto.appendToKey = function(temp, key) {
    if (!(temp instanceof oiModelBaseDataTempFactory)) { return; }

    var list, data = this.data;

    if (key in data) {
      list = data[key];

      if (!angular.isArray(list)) { return; }

    } else {
      list = data[key] = [];
    }

    temp.up = this;
    list.push(temp);

    this.calcDirty();
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.temp = proto.clone;

  return oiModelBaseDataTempFactory;
});
