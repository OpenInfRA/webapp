angular.module('oi.api').factory('oiApiV1SchemaMetadataUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaMetadataUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaMetadataUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.get = function(uuid) {
    return this.cache.get([ this.path, 'object', uuid ]).then(function(data) {
      return (data && angular.isObject(data)) ? angular.fromJson(data.data) : {};
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _data_json = function(data) {
    return angular.fromJson(data.data) || {};
  };

  var _update = function(that, data, json_new, replace) {
    var json_old = _data_json(data);

    if (typeof(json_new) === 'function') {
      json_new(json_old); // TODO try
      json_new = json_old;

    } else if (angular.isObject(json_new)) {
      if (replace !== true) {
        json_new = angular.extend(json_old, json_new);
      }

    } else {
      return $q.reject();
    }

    data.data = angular.toJson(json_new);

    return that.rest.put([ that.path, data.uuid], data).then(function() { 
      that.cache.clear('GET', [ that.path, 'object', data.objectId ]);
      return json_new;
    });
  };

  var _create = function(that, table, uuid, json) {
    var create;

    if (typeof(table) === 'string') {
      create = {
        tableName : table,
        pkColumn  : 'id'
      };

    } else if (angular.isObject(table)) {
      create = table;
      create.pkColumn = (create.pkColumn || 'id');
    }

    if (!(create.tableName && create.pkColumn)) { return $q.reject(); }

    if (typeof(json) === 'function') {
      var fn = json;
        json = {};
 
      fn(json);

    } else if (!angular.isObject(json)) {
      return $q.reject(); 
    }

    create.objectId = uuid;
    create.data = angular.toJson(json);

    return that.rest.post(that.path, create).then(function(post) { 
      return json; 
    });
  };

  proto.set = function(table, uuid, json, replace) {
    var that = this;

    return this.rest.get([ this.path, 'object', uuid ]).then(function(data) {
      if (angular.isObject(data) && data.uuid) {
        return _update(that, data, json, replace);

      } else {
        return _create(that, table, uuid, json);
      }

    }, function() {
      return _create(that, table, uuid, json);
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaMetadataUtilFactory;
});
