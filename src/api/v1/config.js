angular.module('oi.api').config(function(oiBackendApiProvider) {
  'use strict';

  oiBackendApiProvider.api('v1', {
    utilFactoryDefault   : 'oiBackendCrudUtilFactory',
    objectFactoryDefault : 'oiBackendCrudObjectFactory',

    compileUtilDefinition : function(def, conf) {
      var crud = conf.crud;
      if (crud === true) {
        crud = { create : true, update : true, destroy : true, read : true, list : true };

      } else if (!angular.isObject(crud)) {
        crud = {};
      }

      def.crud = crud;

      if (typeof(conf.merge) === 'function') {
        def.merge = conf.merge;
      }
    }
  });
});
