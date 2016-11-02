angular.module('oi.model').factory('oiModelSchemaTopCharUtilFactory', function ($q, $log, oiModelBaseUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseUtilFactory;

  var oiModelSchemaTopCharUtilFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaTopCharUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    this.__ti_api = this.api.up.util('topicinstances');
    this.__config = this.schema.webappData.topchars || {}; // perl config

    var that = this;

    return this.schema.getModelUtil('Relation').init().then(function(util) {
      that.__r_util = util;
    });
  });

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.config = function(uuid, key) {
    var ds = this.__config[uuid] || {};

    if (typeof(key) === 'string') { return ds[key]; }

    return ds;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _data_parent, _seek_parent, _data_parents;

  _seek_parent = function(that, ti_api, ti_uuid, tc_uuid) {
    return ti_api.read(ti_uuid, 'associationsfrom', 'topiccharacteristics', tc_uuid).then(function(list) {
      var data = ti_api.dataSimplify(list[0].associationInstance);

      ti_api.metadata(ti_uuid, { parentInstance : data.uuid }); // asynchron updaten lassen

      return data;
    });
  };

  _data_parent = function(that, ti_api, tc_uuid, ti_data, ti_meta) {
    var p_tc_uuid = that.config(tc_uuid, 'parent');
    if (!p_tc_uuid) { return $q.reject(); }

    if (ti_meta && ('parentInstance' in ti_meta)) {
      return ti_api.dataRead(ti_meta.parentInstance);
    }

    var ti_uuid = angular.isObject(ti_data) ? ti_data.uuid : ti_data;

    return ti_api.metadata(ti_uuid).then(function(meta) {
      if ('parentInstance' in meta) {
        return ti_api.dataRead(meta.parentInstance);
      }

      return _seek_parent(that, ti_api, ti_uuid, p_tc_uuid);
    });
  };

  proto.dataParent = function(uuid, load, meta) {
    return _data_parent(this, this.__ti_api, uuid, load, meta);
  };

  _data_parents = function(that, ti_api, uuid, load, meta) {
    return _data_parent(that, ti_api, uuid, load, meta).then(function(data) {
      return _data_parents(that, ti_api, data.topicCharacteristic.uuid, data).then(function(list) {
        var par = list[list.length - 1];
        var rel = that.__r_util.lookupRelation(par.topicCharacteristic.uuid, data.topicCharacteristic.topic.uuid);

        data.parentInstance = par;
        data.parentRelation = rel;

        list.push(data);

        return list;

      })['catch'](function() {
        return [ data ];
      });
    });
  };

  proto.dataParents = function(uuid, load, meta) {
    return _data_parents(this, this.__ti_api, uuid, load, meta);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _data_labels = function(keys, data) {
    var vals = [];

    if ('values' in data) {
      var values = data.values;

      for (var i in keys) {
        vals.push( values[keys[i]] );
      }
    }

    return vals;
  };

  proto.dataLabels = function(keys, data) {
    if (!angular.isArray(keys)) {
      keys = this.config(keys, 'label');
    }

    if (keys && !keys.length && angular.isObject(data)) { return []; }

    return _data_labels(keys, data);
  };

  proto.fnDataLabels = function(keys) {
    if (!angular.isArray(keys)) {
      keys = this.config(keys, 'label');
    }

    if (keys && keys.length) { 
      return function(data) { return _data_labels(keys, data); };

    } else {
      return function(data) { return [ { 'xx' : data.uuid } ]; };
    }
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.lookupRelation = function(from, to) {
    return this.__r_util.lookupRelation(from, to);
  };

  var _end_parent = function(that, end) {
    var par = that.config(end, 'parent');
    if (!par) { return; }

    if (angular.isArray(par)) { return par[0]; }

    return par;
  };

  var _resolve_end = function(that, from, to) {
    var end = { 
      config : that.config(to) || {}
    };

    var p_to = _end_parent(that, to);
    if (p_to === from) {
      end.isChild = true;
    }

    var p_fr = _end_parent(that, from);
    if (p_fr === to) {
      end.isParent = true;
    }

    end.type = end.config.type || 'default';
 
    return end;
  };

  var _resolve_rel = function(that, from, to, list, reverse) {
    var data = {
      start : from,
      end   : to,

      from  : reverse ? to : from,
      to    : reverse ? from : to,

      label : that.__r_util.relationTypes[list[1]],
      min   : list[2],
      max   : list[3],

      reverse  : !!reverse,

      $end : _resolve_end(that, from, to)
    };

    return data;
  };

  proto.resolveRelation = function(from, r_uuid) {
    var tc_rels = this.__r_util.relations[from];
    if (!tc_rels) { return; }

    var to = tc_rels[0][r_uuid];
    if (to) { return _resolve_rel(this, from, to); }

    var fr = tc_rels[1][r_uuid];
    if (fr) { return _resolve_rel(this, from, fr, true); }
    
    return;
  };

  proto.resolveTopCharRelation = function(from, to, reverse) {
    var rels = reverse ? this.__r_util.relations[to] : this.__r_util.relations[from];
    if (!rels) { return; }

    var r_uuid = reverse ? this.__r_util.lookupRelation(to, this.schema.topcharTopics[from])
                         : this.__r_util.lookupRelation(from, this.schema.topcharTopics[to]);

    var rel = rels[0][r_uuid];
    if (!rel) { return; }

    return _resolve_rel(this, from, to, rel, reverse);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaTopCharUtilFactory;
});
