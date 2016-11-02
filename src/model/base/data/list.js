angular.module('oi.model').factory('oiModelBaseDataListFactory', function ($q, $log, oiUtilProtoBuild) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiModelBaseDataListFactory = function(base, args) {
    angular.extend(this, base);

    this.__base = base;

    if ('up' in args) { this.up = args.up; }
  };

  var proto = oiModelBaseDataListFactory.prototype;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = oiUtilProtoBuild.initOnceWithPromise(function() {
    var that = this,
        wait = [];

    if (!('path' in this)) { this.path = []; }

    if (!('size' in this)) { this.size = 30; }

    if (!('count' in this)) {
      wait.push( 
        this.api.count(this.path).then(function(count) { 
          that.count = count; 
        })
      );
    }

    return $q.all(wait);
  });


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.enumeratePageData = function(page, fn) {
        page = (parseInt(page, 10) || 1);

    var size = this.size,
        off  = (page - 1) * size;
 
    var query = {
      size   : size,
      offset : off
    };

    if (this.orderBy) { query.orderBy = this.orderBy; }

    return this.api.dataEnumerate([ this.path, query ], fn);
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiModelBaseDataListFactory;
});
