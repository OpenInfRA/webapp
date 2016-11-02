angular.module('oi.api').factory('oiApiV1SchemaMultiplicitiesUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaMultiplicitiesUtilFactory = function(args) {
    SUPER.call(this, args);
  
    this.locale  = {};
    this.locales = [];
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaMultiplicitiesUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _key = function(val, none) {
    if (val === 0) { return 0; }
    return val ? val : none;
  };

  var _mult_key = function(min, max) {
    min = _key(min, 0);
    max = _key(max, 'null');

    return min+':'+max;
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var MULT = this.multiplicities = {};

    return this.cache.enumerate(this.path, function(mult) {
      var key = _mult_key(mult.min, mult.max);
      MULT[key] = mult;
    });
  });

  proto.resolveMultiplicity = function(data, base) {
    var min, max, key,
        that = this;

    if (angular.isArray(data)) {
      min = data[0]; 
      max = data[1];
      key = _mult_key(min, max);

    } else if (angular.isObject(data)) {
      min = data.min;
      max = data.max;
      key = _mult_key(min, max);
    }

    if (!min) { min = 0; }

    if (base && (_mult_key(base.min, base.max)) === key) { return base; }

    if (!key) { return; }

    var MULT = this.multiplicities;
    if (key in MULT) { return MULT[key]; }

    return that.rest.post(that.path, { min : min, max : max }).then(function(ds) {
      return that.rest.get([ that.path, ds.uuid ]); 

    }).then(function(data) {
      MULT[key] = data;
      return data;
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaMultiplicitiesUtilFactory;
});
