angular.module('oi.api').factory('oiApiV1SchemaUtilFactory', function ($q, $log, oiBackendCrudUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiBackendCrudUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaUtilFactory = function(args) {
    SUPER.call(this, args);

    this.shared    = this.up.shared || {};
    this.dataModel = this.definition.dataModel;
  };
  
  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.trid = function() {
    return this.read({ size : 1 }).then(function(data) {
      return data.trid;
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.primer = function() { // TODO memoize
    var primer = this.definition.primer;
    if (!primer) { return {}; }

    if (primer === true) { primer = this.path[this.path.length-1]; }

    return this.shared.schema.primer(primer);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.metadata = function(uuid, json, replace) { 
    var md_util = this.shared.metadata;
    if (!md_util) { return $q.reject(); }

    var md_table = this.definition.metadata;
    if (!md_table) { return $q.resolve({}); }

    if (typeof(uuid) !== 'string') { return $q.reject(); }

    if (json) {
      return md_util.set(md_table, uuid, json, replace);

    } else {
      return md_util.get(uuid);
    }
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataPrimer = function(full) {
    var that = this;

    return this.primer().then(function(data) {
      return full ? $q.when( that.dataPrimerFull(data, full) ) : data;

    }).then(function(data) {
      return that.dataSimplify(data);

    }).then(function(data) {
      if (full) { data.$full = full; }

      return data;
    });
  };

  var _data_read = function(that, id, full) {
    var read = that.read(false, id);
    if (!full) { return read; }

    return read.then(function(data) {
      return that.dataSimplify(data);

    }).then(function(data) {
      return $q.when( that.dataExtend(id, data, full) ).then(function() {
        return data;
      });
    });
  };

  proto.dataRead = function(id, full) {
    if (!id) { return $q.reject(); }

    var that = this;

    return _data_read(this, id, full).then(function(data) {
      return that.dataSimplify(data);

    }).then(function(data) {
      if (full) { data.$full = full; }

      return data;
    });
  };

  var _simplify_extend = function(that, data, full) {
    return that.dataSimplify(data);

/*
    return that.dataSimplify(data).then(function(data) {
      return that.dataExtend(data, full);
    });
*/
  };

  proto.dataAll = function(query, full) {
    if (typeof(query) === 'boolean') {
      full  = query;
      query = [];
    }

    var that  = this,
        items = [];

    return this.enumerate(query, function(data) {
      items.push( _simplify_extend(that, data, full) );

    }).then(function() {
      return $q.all(items);
    });
  };

  proto.dataEnumerate = function(query, fn, full) {
    if (typeof(query) === 'function') {
      full  = fn;
      fn    = query;
      query = [];

    } else if (typeof(fn) !== 'function') { 
      return $q.reject(); 
    }

    var that = this,
        wait = [];

    return this.enumerate(query, function(data, i) {
      wait.push( 
        $q.when( _simplify_extend(that, data, full) ).then(function(data) {
          return $q.when( fn.call(that, data, i) );
        })
      );

    }).then(function(size) {
      return $q.all(wait).then(function() {
        return size;
      });
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataWrite = function(data) {
    if (!data) { return $q.reject(); }

    if (data.uuid) {
      return this.dataUpdate(data.uuid, data);
 
    } else {
      return this.dataCreate(data);
    }
  };


  /* ------------------------------------------------------------------ */

  proto.dataCreate = function(data) {
    if (!data) { return $q.reject(); }

    data = angular.copy(data);

    var full = data.$full;
    delete(data.$full);

    data = this.dataApify(data);

    var that = this;

    return $q.when(data).then(function(data) {
      return that.create(data);

    }).then(function(id) {
      if (!full) { return id; }

      return $q.when(that.dataWriteFull(id, data, full)).then(function() {
        return id;
      });
    });
  };

  proto.dataUpdate = function(id, data) {
    if (!id || !data) { return $q.reject(); }

    data = angular.copy(data);

    var full = data.$full;
    delete(data.$full);

    var that = this,
        base, dapi;

    return _data_read(this, id, full).then(function(b) {
      base = b;
      return $q.when(that.dataApify(data, base));

    }).then(function(d) {
      dapi = d;
      return that.update(id, dapi);

    }).then(function(done) {
      if (!full) { return; }

      return $q.when(that.dataWriteFull(id, dapi, full, base)).then(function(fdone) {
        return done || fdone;
      });
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataSimplify = function(data) {
    var model = this.dataModel;
    if (!model) { return data; }

    return this.shared.schema.simplify(model, data);
  };

  proto.dataApify = function(data, base) {
    var model = this.dataModel;
    if (!model) { return data; }

    return this.shared.schema.apify(model, data, base);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // (data, full);
  proto.dataPrimerFull = function() {};
  proto.dataExtend     = function() {};

  // (id, data, full);
  proto.dataWriteFull  = function() {};

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaUtilFactory;
});
