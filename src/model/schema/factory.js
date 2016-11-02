angular.module('oi.model').factory('oiModelSchemaFactory', function ($q, $log, oiModelBaseFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseFactory,
      SUPER_init = SUPER.prototype.init,
      SUPER_extendTypeBase  = SUPER.prototype.extendTypeBase,
      SUPER_extendModelBase = SUPER.prototype.extendModelBase;


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelSchemaFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelSchemaFactory, SUPER);

  /* ------------------------------------------------------------------ */

  var _load_meta = function(that) {
    var api = that.api;

    return $q.when(api.init()).then(function() {
      return api.metadata();

    }).then(function(meta) {
      if (!meta) { meta = {}; }

      that.registerCustomTypes(meta.customTypes); // topchars
      that.registerConfigurations(meta.configurations); // all compiled configs

      that.configuration = meta.configuration || {};
    });
  };

  var _load_wapp = function(that) {
    var data = that.webappPro ? that.webappPro.read() : {};

    return $q.when(data).then(function(data) {
      that.webappData = data;
    });
  };

  var _init_topchars = function(that, list) {
    var item, tcs = {}, tcts = {}, topics = {};

    for (var i in list) {
      item = list[i];

      tcs[item.uuid]  = item;
      tcts[item.uuid] = item.topic.uuid;
      
      topics[item.topic.uuid] = item.uuid;
    }

    that.topchars      = tcs;
    that.topcharTopics = tcts;
    that.topics        = topics;
  };

  var _init_rels = function(that) {
    var util = that.__rels_util = that.getModelUtil('Relation');
    return util.init();
  };

  var _init_vls = function(that) {
    var util = that.__vls_util = that.getModelUtil('ValueList');
    return util.init();
  };

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var that = this,
         api = this.api;

    return $q.when(SUPER_init.call(this)).then(function() {
      return api.init();

    }).then(function() {
      return $q.all([
        api.util('topiccharacteristics').dataAll(),
        _load_meta(that),
        _load_wapp(that)
      ]);

    }).then(function(load) {
      _init_topchars(that, load[0]);

      return $q.all([
        _init_rels(that),
        _init_vls(that)
      ]);
    });
  });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.extendModelBase = function(base) {
    SUPER_extendModelBase.call(this, base);

    base.schema = this;
  };

  proto.extendTypeBase = function(base) {
    SUPER_extendTypeBase.call(this, base);

    base.schema = this;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.getTopChar = function(uuid) { return this.getModel('TopChar', uuid); };
  proto.getTopInst = function(uuid) { return this.getModel('TopInst', uuid); };

  proto.getTopCharByTopic = function(uuid) { return this.getModel('TopChar', this.topics[uuid]); };

  proto.locales = function() { return this.api.locales(); };  // TODO ???


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelSchemaFactory;
});
