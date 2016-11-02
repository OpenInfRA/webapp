angular.module('oi.model').factory('oiModelBaseDataConfTempFactory', function ($q, $log, oiModelBaseDataTempFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseDataTempFactory, 
      SUPER_initData = SUPER.prototype.initData,
      SUPER_cloneBase = SUPER.prototype.cloneBase,
      SUPER_manipulateCopy = SUPER.prototype.manipulateCopy;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelBaseDataConfTempFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelBaseDataConfTempFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.initData = function(init) {
    var conf = this.data.configuration || (this.data.configuration = {});

    var util = this.util;
    if (util) { 
      util.expandConfiguration(conf); 
    }

    // we compile the configuration to assure that we always have the
    // exact configuration like the data view

    this.simulateConfiguration();

    return SUPER_initData.apply(this, arguments);
  };

  proto.cloneBase = function() {
    var base = SUPER_cloneBase.apply(this, arguments);

    delete(base.configuration);

    return base;
  };

  proto.simulateConfiguration = function() {
    var conf = angular.copy(this.data.configuration);
    var util = this.util;

    if (util) {
      // we explicitly reduce the configuration first
      // to avoid any surprise later

      util.reduceConfiguration(conf); 
      util.compileConfiguration(conf); 
    }

    this.configuration = conf;
  };

  proto.manipulateCopy = function(copy) {
    SUPER_manipulateCopy.call(this, copy);

    var util = this.util;
    if (util) { util.reduceConfiguration(copy.configuration); }
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseDataConfTempFactory;
});
