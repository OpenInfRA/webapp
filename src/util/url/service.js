angular.module('oi.util').service('oiUtilUrl', function () {
  'use strict';

  /* ------------------------------------------------------------------ */

  var _flatten = function(args) {
    var list = [];

    angular.forEach(args, function(item) {
      if (angular.isArray(item)) {
        list = list.concat(_flatten(item));

      } else {
        list.push(item);
      } 
    });

    return list;
  };

  this.flattenArgs = function() {
    return _flatten(arguments);
  };

  this.joinURL = function() {
    return _flatten(arguments).join('/');
  };

  this.queryString = function(obj) {
    var str = [];

    for(var p in obj) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }

    return str.join('&');
  };

  /* ------------------------------------------------------------------ */
});
