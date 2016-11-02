angular.module('oi.api').constant('oiApiV1SchemaConfig', {
  utilFactoryDefault   : 'oiApiV1SchemaUtilFactory',
  objectFactoryDefault : 'oiApiV1SchemaObjectFactory',

  compileUtilDefinition : function(def, conf) {
    'use strict';

    var copy = [ 'dataModel', 'metadata' ];

    angular.forEach(copy, function(key) {
      var val = conf[key];
      if (typeof(val) === 'string') { def[key] = val; }
    });

    if ((conf.primer === true) || (typeof(conf.primer) === 'string')) {
      def.primer = conf.primer;
    }

    var mergeInto = conf.mergeInto;
    if (mergeInto) {
      if (angular.isArray(mergeInto)) {
        def.mergeInto = function(data, into) {
          angular.forEach(mergeInto, function(key) {
            if (key in data) { into[key] = data[key]; }
          });
        };

      } else if (typeof(mergeInto)) {
        def.mergeInto = mergeInto;
      }
    }
  }
});
