angular.module('oi.api').factory('oiApiV1SchemaTopCharUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild, oiUtilProgress) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaTopCharUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaTopCharUtilFactory, SUPER);


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.prepareCreate = function(data) {
    var topic = data.topic;
    if (!topic) { return; }

    var util = this.shared.schema.util('valuelistvalues');

    return util.create(topic).then(function(id) {
      return util.get(id).then(function(tdata) {
        data.topic = tdata;
      });
    });
  };

  proto.prepareUpdate = function(data) {
    var topic = data.topic;
    delete(data.topic);

    // remove the topic in any case, we update it here 

    if (!topic || !topic.uuid) { return; }

    // wenn names und descriptions uuids haben, wurde nichts geaendert
    if (topic.names.uuid && topic.descriptions.uuid) { return; }

    var util = this.shared.schema.util('valuelistvalues');
    var that = this;

    return util.update(topic.uuid, topic).then(function() {
      // tc cache deaktivieren, wenn topic aktualisiert
      that.clearCache(data.uuid);
    });
  };

  proto.mergeInto = function(data, into) {
    angular.forEach([ 'topic', 'descriptions' ], function(key) {
      if (key in data) { into[key] = data[key]; }
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _sort_by_order = function(a, b) { return a.order - b.order; };

  var _load_attr_groups = function(that, uuid, dconfs) {
    var load = {
      groups : that.read(false, uuid, 'attributetypegroups'),
      detail : that.read(false, uuid, 'detail')
    };

    return $q.all(load).then(function(load) {
      var atGs = {};

      angular.forEach(load.detail.attributeTypeGroupToAttributeTypes, function(atg) {
        var atG = atGs[atg.attributeTypeGroup.uuid] = atg.attributeTypeToAttributeTypeGroup;
            atG.sort(_sort_by_order);
      });

      var list = load.groups;
      var llen = list.length;

      for (var i = 0; i < llen; i++) {
        var ag = list[i];
            ag.configuration = dconfs[ag.uuid];

        var attr = ag.attributes = atGs[ag.attributeTypeGroup.uuid];
        var alen = attr.length;
       
        for (var j = 0; j < alen; j++) {
          var at = attr[j];
              at.configuration = dconfs[at.uuid];
        }
      }

      list.sort(_sort_by_order);

      return list;
    });
  };

  proto.dataExtend = function(uuid, data, full) {
    var that = this;

    return this.readConfigurations(uuid).then(function(dconfs) {
      data.configuration = dconfs[uuid];

      return _load_attr_groups(that, uuid, dconfs).then(function(list) {
        return that.shared.schema.simplifyList('AttributeGroup', list);

      }).then(function(list) {
        data.attributeGroups = list;

        return data;
      });
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _init_data_confs = function() {
    var confs = {};

    var tc = confs.TopicCharacteristic = {};
    var ag = confs.AttributeGroup      = {};
    var at = confs.Attribute           = {};

    return [ confs, tc, ag, at ];
  };

  var _ext_data_conf = function(data) {
    var conf = data.configuration;
    if (!conf) { return; }

    delete(data.configuration);

    return conf;
  };

  var _write_attrgroup = function(util, data) {
    if (data.uuid) {
      return util.update(data.attributeTypeGroup.uuid, data);

    } else {
      return util.create(data).then(function(uuid) { data.uuid = uuid; });
    }
  };

  var _write_attribute = function(util, data) {
    if (data.uuid) {
      return util.update(data.uuid, data);

    } else {
      return util.create(data).then(function(uuid) { data.uuid = uuid; });
    }
  };

  var _can_delete_attrgroup = function(data) {
    var conf = data.configuration;
    if (!conf) { return; }

    if (!conf.model || !conf.model.deleted) { return; }

    var list = data.attributes;
    if (!list) { return; }

    if (list.length === 0) { return true; }

    return false;
  };

  proto.dataWriteFull = function(uuid, data, full, base) {
    var confs = _init_data_confs();
        confs[1][uuid] = data.configuration;

    var ags = data.attributeGroups;
    if (!ags) { ags = []; }

    var ag_confs = confs[2],
        at_confs = confs[3];

    var D = $q.defer();
    var P = oiUtilProgress.create({ ticks : ags.length + 2, notify : function(pro) { D.notify(pro); } });
        P.tick();

    var util_ag = this.object(uuid).util('attributetypegroups');
    var util_at = this.shared.schema.util('attributetypesattributetypegroupsassociations');

    var wait_ag = [];

    var del_ag = [];

    angular.forEach(ags, function(ag, i) {
      // we remove the configuration since it was us that put it there
      // in the first place

      var ag_conf = _ext_data_conf(ag);

      if (_can_delete_attrgroup(ag)) {
        // configuration.model.deleted is true-ish and attributes is empty
        // we need to wait for the delete, since there might be still attributes
        // associated, that where moved to a "later" group.

        del_ag.push(ag);

        // ag_conf = {}; // destroy bug

        return;
      }

      ag.order = i;

      var write_ag = _write_attrgroup(util_ag, ag).then(function() {
        // we must wait for the write, because it could be a create
        // and we need the uuids for the attributes, etc.
 
        if (ag_conf) { ag_confs[ag.uuid] = ag_conf; }

        var ats = ag.attributes;
        if (!ats) { ats = []; }

        var PP = P.create(ats.length + 1);
            PP.tick();

        var wait_at = [];

        angular.forEach(ag.attributes, function(at, i) {
          at.order = i;
          at.attributeTypeGroup = ag.attributeTypeGroup; // if moved!

          var at_conf = _ext_data_conf(at);

          var write_at = _write_attribute(util_at, at).then(function() {
            // we wait for the write, because it could be a create
            // an we need the uuid!

            PP.tick();

            if (at_conf) { at_confs[at.uuid] = at_conf; }
          });

          wait_at.push(write_at);
        });

        return $q.all(wait_at);
      });

      wait_ag.push(write_ag);
    });

/*
   // there is some bug
    angular.forEach(del_ag, function(ag) {
      wait_ag.push( util_ag.destroy(ag.attributeTypeGroup.uuid) );
    });
*/

    var that = this;

    $q.all(wait_ag).then(function() {
      // we wait 'til all the writes are done, cause some configs 
      // need a created uuid to be assigned, etc.

      return that.writeConfigurations(uuid, confs[0]);

    }).then(function() { 
      P.tick(); 
      D.resolve(); 

    })['catch'](function() {
      D.reject();
    });

    return D.promise;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.readConfigurations = function(uuid) { 
    return this.metadata(uuid).then(function(meta) {
      return meta.dataConfigurations || {};
    });
  };

  proto.writeConfigurations = function(uuid, mconfs) {
    // mconfs ::= { model : { uuid : conf } }

    var dconfs = {};

    // just flatten all confs into one object

    angular.forEach(mconfs, function(confs, model) {
      angular.extend(dconfs, confs);
    });
 
    return this.metadata(uuid, function(meta) {
      // for we merge the new confs with the old confs, so we 
      // we ensure that nothing gets lost, wenn we have only
      // "partial" updates. you need to "null" a config for now

      meta.dataConfigurations = angular.extend({}, meta.dataConfigurations, dconfs);

    }).then(function() { return; });
  };

/*
  var _compile_conf = function(schema, model, conf) {
    if (!conf) { return; }

    var type = conf.modelType || 'default';
    var util = oiTypes.util(model, type);

    return util.compiledConfiguration(conf);
  };

  proto.writeConfigurations = function(uuid, mconfs) {
    var dconfs = {},
        cconfs = {},
        schema = this.shared.schema;

    angular.forEach(mconfs, function(confs, model) {
      angular.extend(dconfs, confs);

      angular.forEach(confs, function(conf, uuid) {
        cconfs[uuid] = _compile_conf(schema, model, conf);
      });
    });
 
    var write_d = this.metadata(uuid, function(meta) {
      // for we merge the new confs with the old confs, so we 
      // we ensure that nothing gets lost, wenn we have only
      // "partial" updates. you need to "null" a config for now

      meta.dataConfigurations = angular.extend({}, meta.dataConfigurations, dconfs);
    });
    
    var tcconf = mconfs.TopicCharacteristic ? mconfs.TopicCharacteristic[uuid] : undefined;

    var write_c = schema.metadata(function(meta) {
      // add and overwrite compiled configurations
      meta.configurations = angular.extend({}, meta.configurations, cconfs);
   
      if (tcconf) {
        var types = meta.customTypes || (meta.customTypes = {} );
            types[uuid] = tcconf.modelType;
      }

    }).then(function() {
      schema.registerConfigurations(cconfs);
    });
  
    return $q.all([ write_d, write_c ]).then(function() { return; });
  };
*/

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaTopCharUtilFactory;
});
