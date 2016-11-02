angular.module('oi.model').factory('oiModelBaseDataConfFactory', function ($q, $log, oiModelBaseDataFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiModelBaseDataFactory,
      SUPER_initData = SUPER.prototype.initData,
      SUPER_cloneBase = SUPER.prototype.cloneBase,
      SUPER_manipulateCopy = SUPER.prototype.manipulateCopy;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelBaseDataConfFactory = function(base, args) {
    SUPER.call(this, base, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiModelBaseDataConfFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.initData = function() {
    var conf = this.data.configuration || (this.data.configuration = {});
    var copy = angular.copy(this.data.configuration);

    var util = this.util;
    if (util) { 
      util.expandConfiguration(conf); 
      util.compileConfiguration(copy);
    }

    this.configuration = copy;

    return SUPER_initData.apply(this, arguments);
  };

  proto.cloneBase = function() {
    var base = SUPER_cloneBase.apply(this, arguments);

    delete(base.configuration);

    return base;
  };

  proto.manipulateCopy = function(copy) {
    SUPER_manipulateCopy.call(this, copy);

    var util = this.util;
    if (util) { util.reduceConfiguration(copy.configuration); }
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseDataConfFactory;
});
