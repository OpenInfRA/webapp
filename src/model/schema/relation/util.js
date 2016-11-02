angular.module('oi.model').factory('oiModelSchemaRelationUtilFactory', function ($q, $log, oiModelBaseUtilFactory, oiUtilProtoBuild, oiConfig, oiUtil) {
  'use strict';

  var DS_VER = 3;

  var SUPER = oiModelBaseUtilFactory;

  var oiModelSchemaRelationUtilFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaRelationUtilFactory, SUPER);


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _version = function(that) { 
    return that.api.trid().then(function(trid) {
      return DS_VER+':'+trid;
    });
  };
 
  var __load_rels = function(that, data) {
    var relData    = data.relations,
        relVersion = data.relationsVersion; 

    if (!angular.isObject(relData) || !relVersion) {    
      return that.compileRelations();
    }

    return _version(that).then(function(version) {
      if (version === relVersion) { return relData; }

      return that.compileRelations();
    });
  };

  var _load_rels = function(that) {
    return __load_rels(that, that.schema.webappData).then(function(rels) {
      that.relations = rels;

      // that.dumpRelations(rels);
    });
  };

  var _load_types = function(that) {
    var util = that.schema.getModelUtil('ValueList');

    return util.init().then(function() {
      return util.systemList('vl_relationship_type');

    }).then(function(list) {
      that.relationTypes = list.values;
    });
  };

  var _build_lookups = function(that) {
    var rels = that.relations;
 
    var lR = that.__lookupRelation  = {}; // fromTopChar:toTopChar => relation
    var lT = that.__lookupToTopChar = {}; // relation              => toTopChar

    for (var FTC in rels) {
      var ftc = rels[FTC];
      var  to = ftc[0];

      for (var REL in to) {
        var rel = to[REL],
            TTC = rel[0];

        lR[ FTC+':'+TTC ] = REL;
        lT[ REL         ] = TTC;
      }
    }
  };

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var that = this;

    return $q.all([
      _load_rels(that),
      _load_types(that)

    ]).then(function() {
      _build_lookups(that);
    });
  });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _compile_rels = function(that) {
    return that.api.relations();
  };

  proto.compileRelations = function() {
    var that = this,
        relData, relVersion;

    return $q.all([ _compile_rels(that), _version(that) ]).then(function(all) {
      relData    = all[0];
      relVersion = all[1];

      return that.schema.webappPro.update({ relations : relData, relationsVersion : relVersion });

    }).then(function() {

      return relData;
    });
  };

  proto.dumpRelations = function(rels) {
    if (!rels) { rels = this.relations; }

    if (!angular.isObject(rels)) { return; }

    var rt, rt_uuid;

    $log.log('relations');

    for (var tc_uuid in rels) { 
      var tc_rels = rels[tc_uuid];

      $log.log('tc', tc_uuid);

      for (rt_uuid in tc_rels[0]) {
        rt = tc_rels[0][rt_uuid];
        $log.log('  ->', rt[0], rt[1], rt_uuid);
      }

      for (rt_uuid in tc_rels[1]) {
        rt = tc_rels[1][rt_uuid];
        $log.log('  <-', rt[0], rt[1], rt_uuid);
      }
    }
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.lookupRelation = function(from, to) { // to ::= topic
    return this.__lookupRelation[ from+':'+to ];
  };
 
  proto.lookupToTopChar = function(rel) {
    return this.__lookupToTopChar[rel]; // topic
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaRelationUtilFactory;
});
