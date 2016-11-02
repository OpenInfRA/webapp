angular.module('oi.model').factory('oiModelSchemaTopInstFactory', function ($q, $log, oiModelBaseFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelSchemaTopInstFactory = function(base, args) {
    SUPER.call(this, base, args);

    if (!this.api && args.api) {
      this.api = args.api.object('topicinstances', this.uuid);
    }

    var schema = this.__schema = this.api.path.concat(schema);
        schema.shift();
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaTopInstFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _init_parent = function(that) {
    var p_uuid = that.topchar.config('parent');
    if (!p_uuid) { return; }

    if (angular.isArray(p_uuid)) { p_uuid = p_uuid[0]; }

    that.__p_tc_uuid = p_uuid;

    var from = that.loaded.assoFrom;
    if (!from) { return; }

    var p_rel = from[p_uuid];
    if (!p_rel) { return; }

    that.__p_rel = p_rel;
  };

  var _init_asso = function(that, list, reverse) {
    var tcs = {},
        tc  = that.topchar;

    for (var i in list) {
      var asso = list[i];
      var uuid = asso.uuid;

      asso.$relation = tc.resolveTopCharRelation(uuid, reverse);
      asso.$reverse  = !!reverse;

      tcs[uuid] = asso;
    }

    return tcs;
  };

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var that = this;

    return $q.when(this.util.init()).then(function() {
      return that.load();

    }).then(function(load) {
      var tc = that.schema.getTopChar(load.data.topicCharacteristic.uuid);
      if (!tc) { return $q.reject({ reason : 'top char model not found' }); }

      return tc.init();

    }).then(function(tc) {
      that.topchar = tc;
      that.type    = tc.config().type;

      var load = that.loaded;

      load.assoTo   = _init_asso(that, load.assoTo);
      load.assoFrom = _init_asso(that, load.assoFrom, true);

      _init_parent(that);
    });
  });

  proto.load = function() {
    if ('loaded' in this) { return $q.resolve(this.loaded); }

    var that = this, 
        api  = this.api;

    return $q.all({
      meta    : api.metadata(),
      data    : api.dataRead(true),

      assoTo   : api.read('associationsto',   'topiccharacteristics'),
      assoFrom : api.read('associationsfrom', 'topiccharacteristics')

    }).then(function(load) {
      that.loaded = load;

      return load;
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.parentRelation = function() {
    var rel = this.__p_rel;
    if (!rel) { return; }

    return rel.$relation;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.dataLabels = function() {
    return this.topchar.dataLabels(this.loaded.data);
  };

  proto.dataParent = function() {
    return this.topchar.dataParent(this.loaded.data, this.loaded.meta);
  };

  proto.dataParents = function() {
    return this.topchar.dataParents(this.loaded.data, this.loaded.meta);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.loadRelationList = function(rel_uuid) {
    var asso = this.loaded.assoTo[rel_uuid];
    if (!asso) { return $q.reject(); }

    var that = this,
      schema = that.schema;

    var topchar = schema.getTopCharByTopic(asso.topic.uuid);
    return topchar.init().then(function(topchar) {
      var args = { 
        uuid    : rel_uuid,

        api     : that.api.util('associationsto'),
        path    : [ 'topiccharacteristics', topchar.uuid ],

        count   : asso.topicInstancesCount,
        orderBy : topchar.orderByValueUUID(),

        topchar  : topchar,
        relation : topchar.resolveRelation(rel_uuid)
      };

      var list = schema.buildTypeList('TopicInstance', args);
      if (!list) { return $q.reject(); }

      return list.init();
    });
  };

  proto.loadTopCharRelationList = function(tc_uuid) {
    var asso = this.loaded.assoTo[tc_uuid] || this.loaded.assoFrom[tc_uuid];
    if (!asso) { return $q.reject(); }

    var that = this,
      schema = that.schema,
     reverse = asso.$reverse,
        util = reverse ? 'associationsfrom' : 'associationsto';

    var topchar = schema.getTopChar(tc_uuid);
    return topchar.init().then(function(topchar) {
      var args = { 
        api     : that.api.util(util),
        path    : [ 'topiccharacteristics', topchar.uuid ],

        count   : asso.topicInstancesCount,
        orderBy : topchar.orderByValueUUID(),

        topchar  : topchar,
        relation : that.topchar.resolveTopCharRelation(tc_uuid, reverse)
      };

      var list = schema.buildTypeList('TopicInstance', args);
      if (!list) { return $q.reject(); }

      return list.init();
    });
  };

  proto.relations = function() {
    var uuid, list = [], seen = {};

    for (uuid in this.loaded.assoTo) {
      list.push( this.loadTopCharRelationList(uuid) );    
      seen[uuid] = true;
    }

    for (uuid in this.loaded.assoFrom) {
      if (!seen[uuid] && (uuid !== this.__p_tc_uuid)) {
        list.push( this.loadTopCharRelationList(uuid) );
        seen[uuid] = true;
      }
    }

    return $q.all(list);
  };


  /* ------------------------------------------------------------------ */

  return oiModelSchemaTopInstFactory;
});
