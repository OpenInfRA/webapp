angular.module('oi.model').factory('oiModelSchemaTopCharFactory', function ($q, $log, oiModelBaseFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelSchemaTopCharFactory = function(base, args) {
    SUPER.call(this, base, args);

    if (!this.api && args.api) {
      this.api = args.api.object('topiccharacteristics', this.uuid);
    }
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaTopCharFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var that = this;

    return $q.when(this.util.init()).then(function() {
      return that.load();

    }).then(function(load) {
      that.__config = angular.extend({}, that.util.config(that.uuid), load.meta); 
      that.initialized = true;

    }, function() {
      that.initialized = false;
      return $q.reject({ reason : 'topchar model load failed' });
    });
  });

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.load = function(force) {
    if (('loaded' in this) && !force) { return $q.resolve(this.loaded); }

    var that = this;
    var api  = this.api;

    return $q.all({
      meta : api.metadata(),
      data : api.dataRead(true)

    }).then(function(load) {
      that.loaded = load;

      return load;
    });
  };

  
  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.config = function(key) {
    if (key) { return this.__config[key]; }
    return this.__config;
  };

  proto.configValue = function(key) {
    var keys = this.__config;
    if (!key) { return; }

    if (typeof(key) !== 'string') { return; }

    return keys[key];
  };

  proto.orderByValueUUID = function() {
    var topchar = this.configValue('label');
    if (!topchar) { return; }

    return topchar[0];
  };

  proto.embedUUID = function() {
    return this.configValue('embed');
  };

  proto.listUUID = function() {
    return this.configValue('list');
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // -> [ { group{}, attributes[] }+ ]

  proto.attrGroups = function() { // TODO remove
    // aktuell laden wir beide endpoints und fuehren diese dann zusammen, da in detail leider
    // die multiplicity fehlt.

    var load = {
      groups : this.api.read('attributetypegroups'),
      detail : this.api.read('detail')
    };

    return $q.all(load).then(function(load) {
      var lg = {};

      angular.forEach(load.groups, function(group) {
        lg[group.attributeTypeGroup.uuid] = group;
      });

      var list = [];

      angular.forEach(load.detail.attributeTypeGroupToAttributeTypes, function(group) {
        list.push({ uuid : group.attributeTypeGroup.uuid, group : lg[ group.attributeTypeGroup.uuid ], attributes : group.attributeTypeToAttributeTypeGroup });
      });

      return list;
    });
  };

  proto.attrtypegroups = function() { // TODO remove
    return this.api.read('attributetypegroups');
  };

  var _sort_by_order = function(a, b) { return a.order - b.order; };

  proto.listAttrGroups = function() {
    var that = this;
    var load = {
      groups : this.api.read('attributetypegroups'),
      detail : this.api.read('detail') // attributetypes to groups
    };

    return $q.all(load).then(function(load) {
      var attrs = {};

      angular.forEach(load.detail.attributeTypeGroupToAttributeTypes, function(group) {
        attrs[group.attributeTypeGroup.uuid] = group.attributeTypeToAttributeTypeGroup;
      });
 
      load.groups.sort(_sort_by_order);

      var list = [];

      angular.forEach(load.groups, function(group) {
        var uuid = group.attributeTypeGroup.uuid; 
        var attr = attrs[uuid];

        var api = that.api.object('attributetypegroups', uuid);
        var obj = that.model.create('AttrGroup', {
          uuid : group.uuid, api : api, project : that.schema, topchar : that,
          __loaded : { get : group, attrs : attr }
        });

        list.push(obj);
      });
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _update_atG = function(that, agT, atG) {
    $log.log(that, agT, atG);

    var util = that.api.shared.schema.util('attributetypesattributetypegroupsassociations');
    var crud;

    if (atG.uuid) {
      crud = util.update(atG.uuid, atG).then(function() {
        $log.log('updated atG');
      });
    }

    return crud;
  };

  var _update_agT = function(that, agT) {
    var list = agT.attributeTypeG;
    // var util = that.api.util('attributetypegroups');
    var crud;
  
    if (agT.uuid) {
      crud = $q.resolve(agT);
      // crud = util.update(agT.attributeTypeGroup.uuid, agT).then(function() { return agT; });

    } else {
      crud = $q.reject();
      //crud = util.create(agT).then(function(uuid) { return util.read(uuid); });
    }

    return crud.then(function(agT) { 
      $log.log('agT', agT);

      var wait = [];
      var llen = list.length;

      for (var i = 0; i < llen; i++) {
        var atG = list[i];
            atG.order = i;

        wait.push(_update_atG(that, agT, atG));
      }
 
      return $q.all(wait);
    });
  };

  proto.updateAttributeGroupTs = function(list) {
    var wait = [];
    var llen = list.length;

    for (var i = 0; i < llen; i++) {
      var agT = list[i];
          agT.order = i;

      wait.push(_update_agT(this, agT));
    }

    return $q.all(wait);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.buildTopInstList = function(args) {
    args = angular.isObject(args) ? angular.extend({}, args) : {};

    args.api     = this.api.util('topicinstances');
    args.orderBy = this.orderByValueUUID();

    args.topchar = this;

    return this.__UP.buildTypeList('TopicInstance', args);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.canParent = function() {
    return !!this.__config.parent;
  };

  proto.dataParent = function(load, meta) {
    if (!this.__config.parent) { return $q.reject(); }
    return this.util.dataParent(this.uuid, load, meta);
  };

  proto.dataParents = function(load, meta) {
    if (!this.__config.parent) { return $q.reject(); }
    return this.util.dataParents(this.uuid, load, meta);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.hasLabels = function() { return !!this.__config.label; };

  proto.dataLabels = function(data) {
    var keys = this.__config.label;
    if (!keys) { return; }

    return this.util.dataLabels(keys, data);
  };

  proto.fnDataLabels = function() {
    var keys = this.__config.label;
    return this.util.fnDataLabels(keys);
  };

  proto.lookupRelation = function(uuid, reverse) {
    if (reverse) {
      return this.util.lookupRelation(uuid, this.uuid);

    } else {
      return this.util.lookupRelation(this.uuid, uuid);
    }
  };

  proto.resolveTopCharRelation = function(uuid, reverse) {
    return this.util.resolveTopCharRelation(this.uuid, uuid, reverse);
  };

  proto.resolveRelation = function(uuid) {
    return this.util.resolveRelation(this.uuid, uuid);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaTopCharFactory;
});
