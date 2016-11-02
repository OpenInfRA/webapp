angular.module('oi.model').factory('oiModelBaseDataConfUtilFactory', function ($q, $log, oiModelBaseDataUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseDataUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelBaseDataConfUtilFactory = function(base) {
    SUPER.call(this, base);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelBaseDataConfUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.expandConfiguration = function(conf) {
    if (!conf.modelType) { conf.modelType = this.definition.type; }

    if (!angular.isObject(conf.model)) { conf.model = {}; }
    if (!angular.isObject(conf.type))  { conf.type  = {}; }

    var mconf = conf.model;

    mconf.visible = !mconf.hidden;
    delete(mconf.hidden);

    mconf.editable = !mconf.uneditable;
    delete(mconf.uneditable);

    this.expandModelConf(mconf);
    this.expandTypeConf(conf.model);
  };

  proto.expandModelConf = function(conf) {};
  proto.expandTypeConf  = function(conf) {};


  /* ------------------------------------------------------------------ */

  proto.reduceConfiguration = function(conf) {
    var mconf = conf.model;
    var tconf = conf.type;

    this.reduceModelConf(mconf);
    this.reduceTypeConf(tconf);

    if (!mconf.visible) { mconf.hidden = true; }
    delete(mconf.visible);

    if (!mconf.editable) { mconf.uneditable = true; }
    delete(mconf.editable);

    if (angular.equals(mconf, {})) { delete(conf.model); }
    if (angular.equals(tconf, {})) { delete(conf.type);  }

    if (conf.modelType === 'default') { delete(conf.modelType); }
  };
 
  proto.reduceModelConf = function(conf) {};
  proto.reduceTypeConf  = function(conf) {};


  /* ------------------------------------------------------------------ */

  proto.compileConfiguration = function(conf) {
    var dconf = this.definition.configuration || {};
    var mconf = conf.model || {};
    var tconf = conf.type  || {};

    proto.compileModelConf(mconf);
    proto.compileTypeConf(tconf);
 
    if (dconf.deleted || mconf.deleted) {
      conf.deleted = true;
      conf.hidden  = true;

      delete(mconf.deleted);
    }

    if (dconf.hidden || mconf.hidden) {
      conf.hidden = true;
      delete(mconf.hidden);
    }

    if (dconf.uneditable || mconf.uneditable) {
      conf.uneditable = true;
      delete(mconf.uneditable);
    }
  
    if (angular.equals(conf.model, {})) { delete(conf.model); }
  };

  proto.compileModelConf = function(conf) {};
  proto.compileTypeConf  = function(conf) {};

  proto.compiledConfiguration = function(conf) {
    conf = angular.copy(conf);
    this.compileConfiguration(conf);
    return conf;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseDataConfUtilFactory;
});
