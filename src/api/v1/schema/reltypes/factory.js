angular.module('oi.api').factory('oiApiV1SchemaRelTypesUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaRelTypesUtilFactory = function(args) {
    SUPER.call(this, args);
  
    this.locale  = {};
    this.locales = [];
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaRelTypesUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _trid = function(that, off) {
    var rt_trid;

    return that.read({ offset : off, size : 1 }).then(function(rt) {
      if (!angular.isArray(rt) && rt.length > 0) { return 0; }

      rt_trid = rt[0].trid;
      return that.read(rt[0].uuid, { size : 1 });

    }).then(function(rt2tc) {
      if (!angular.isArray(rt2tc) && rt2tc.length > 0) { return _trid(that, off+1); }

      return rt_trid+':'+rt2tc.trid;

    }, function() {
      return 0;
    });
  };

  proto.trid = function() {
    return _trid(this, 0);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _load_tc_rels = function(tc_api, rels, tops, tc_ds) {
    var tc_uuid = tops[tc_ds.topic.uuid] = tc_ds.uuid;

    return tc_api.enumerate(tc_uuid, 'relationshiptypes', function(rt_ds) {
      var rt_uuid = rt_ds.relationshipType.uuid,
          to_uuid = rt_ds.relationshipType.relationshipType.uuid, // TOPIC!
          descr   = rt_ds.relationshipType.description.uuid,
          min     = rt_ds.multiplicity.min,
          max     = rt_ds.multiplicity.max;

      rels.push([ tc_uuid, rt_uuid, to_uuid, descr, min, max ]);
    });
  };

  var _load_rels_tops = function(that) {
    var tc_api = that.up.util('topiccharacteristics'),
        rels   = [],
        tops   = {},
        wait   = [];

    return tc_api.enumerate(function(tc_ds) {
      wait.push( _load_tc_rels(tc_api, rels, tops, tc_ds) );

    }).then(function() {
      return $q.all(wait);

    }).then(function() {
      return [ rels, tops ];
    });
  };

  var _set_rel = function(rels, fr, pos, tr, to, mult) {
    var tc = rels[fr] || ( rels[fr] = [{}, {}] );
        tc[pos][tr] = [ to ].concat(mult);
  };

  // { topchar_uuid : { reltype_uuid : [   topic_uuid, [ min, max ] ] } }
  // {   topic_uuid : { reltype_uuid : [ topchar_uuid, [ min, max ] ] } }

  proto.relations = function() {
    return _load_rels_tops(this).then(function(reltops) {
      var list = reltops[0],
       // tops = reltops[1],
          rels = {};

      for (var i in list) {
        var rel = list[i];

        var tc_uuid = rel.shift(),
            rt_uuid = rel.shift(),
            to_uuid = rel.shift(); // topic!

        _set_rel(rels, tc_uuid, 0, rt_uuid, to_uuid, rel);
        _set_rel(rels, to_uuid, 1, rt_uuid, tc_uuid, rel);
      }

      return rels;
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaRelTypesUtilFactory;
});
