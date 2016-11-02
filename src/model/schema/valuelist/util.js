angular.module('oi.model').factory('oiModelSchemaValueListUtilFactory', function ($q, $log, oiModelBaseUtilFactory, oiUtilProtoBuild, oiConfig) {
  'use strict';

  var SUPER = oiModelBaseUtilFactory;

  var oiModelSchemaValueListUtilFactory = function(base, args) {
    SUPER.call(this, base, args);

    this.__system_list = {};
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaValueListUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _vl_simple = {
    vl_unit              : true,
    vl_data_type         : true,
    vl_skos_relationship : true
  };

  var _load_system_lists = function(that) {
    var lists = that.__system_lists;
    if (lists) { return lists; }
     
    var api     = that.api,
        schema  = that.schema,
        appData = schema.webappData;

    var listData = appData.systemLists,
        listTrid = appData.systemListsTrid;

    return api.trid().then(function(trid) {
      if (angular.isObject(listData) && (listTrid === trid)) {
        return listData;
      }

      return api.systemLists().then(function(lists) {
        listData = lists;
        return schema.webappPro.update({ systemLists : lists, systemListsTrid : trid });

      }).then(function() {
        return listData;
      });

    }).then(function(lists) {
      that.__system_lists = lists;

      return lists;
    });
  };

  var _load_system_list = function(that, key, uuid) {
    var list = { key : key, uuid : uuid };

    var vals = list.values = {};
    var keys = list.keys   = [];

    var simple = !!_vl_simple[key];

    return that.api.dataEnumerateValueListValues(list.uuid, function(vlv) {
      keys.push(vlv);
 
                    vals[vlv.uuid] = vlv;
      if (simple) { vals[vlv.name] = vlv; }

    }, simple).then(function() {

      that.__system_list[key] = list;
      return list;
    });
  };

  proto.systemLists = function(full) {
    if (!full) { return $q.when(_load_system_lists(this)); }

    var that = this,
        sl   = {};

    return $q.when(_load_system_lists(this)).then(function(lists) {
      var load = [];

      angular.forEach(lists, function(uuid, key) {
        var vals = that.__system_list[key];
        if (vals) {
          sl[key] = vals;
          return; 
        }

        var wait = _load_system_list(that, key, lists[key], wait).then(function(list) {
          sl[key] = list;
        });

        load.push(wait);
      });

      if (!load.length) { return; }

      return $q.all(load);

    }).then(function() {

      return sl;
    });
  };

  proto.systemList = function(key) {
    var vals = this.__system_list[key];
    if (vals) { return $q.resolve(vals); }

    var that = this;

    return $q.when(_load_system_lists(this)).then(function(lists) {
      var uuid = lists[key];
      if (!uuid) { return $q.reject({ reason : 'key "'+key+'" not found!' }); }

      return _load_system_list(that, key, uuid);
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaValueListUtilFactory;
});
