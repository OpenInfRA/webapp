angular.module('oi.').provider('oiDirectiveTemplate', function () {
  'use strict';

  var TPL = {};

  var _register_template = function(dir, key, def) {
    var url;

    if (typeof(def) === 'string') {
      url = def;
      def = { template : def };

    } else if (angular.isObject(def)) {
      url = def.template;

    } else {
      return;
    }

    if (typeof(url) !== 'string') { return; }

    var DIR = TPL[dir] || (TPL[dir] = {});
        DIR[key] = url;
  };

  return {
    // -- returned during config phase --------------------------------

    // TODO register also information for configuring types with 
    // special templates (label + descr, etc.)

    // .registerTemplate('oiValue', 'my_key', 'my_tpl.html');
    registerTemplate : function(dir, key, def) {
      if (typeof(dir) !== 'string') { return; }

      if (typeof(key) === 'string') {
        _register_template(dir, key, def);

      } else if (angular.isObject(key)) {
        angular.forEach(key, function(def, key) {
          _register_template(dir, key, def);
        });
      }
    },

    // -- returned for oiDirectiveTemplate ----------------------------

    $get : function($log) {
      return {
        template : function(dirKey, tplKey) {
          if (!dirKey) { return; }

          var url, tpl = TPL[dirKey];

          if (!tpl) {
            // $log.debug('no templates registered for directive', dirKey);
            return;
          }

          var keys = [].slice.call(arguments, 0);
          var klen = keys.length;

          if (!klen) { return; }
 
          for (var i = 0; i < klen; i++) {
            url = tpl[keys[i]];
            if (url) { return url; }
          }

          return;
        }
      };
    }
  };
});
