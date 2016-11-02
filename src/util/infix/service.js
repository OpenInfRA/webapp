angular.module('oi.util').service('oiUtilInfix', function ($log) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // ein infix kann mehrere ersetzungen haben. entsprechend entsteht
  // pro ersetzung ein neuer key. der initiale key wird segment fuer
  // segment abgearbeitet und bei jedem infix geteilt und fuer die
  // rest-segmente wieder nach infixen gesucht. gibt es keine segmente
  // mehr, wird der neue key in done abgelegt

  var _unshift_inf = function(infs, strings, split) {
    if (!angular.isArray(infs)) { infs = [ infs ]; }

    var ilen = infs.length;
    var vars = [];

    for (var i = 0; i < ilen; i++) {
      var snew = strings.slice();
      var sinf = infs[i];
      if (split) { sinf = sinf.split(split); }

      snew.unshift.apply(snew, sinf);
      vars.push(snew);
    }

    return vars;
  };

  var _replace_infs = function(pres, strings, INFs, done, split) {
    var first = strings.shift();

    while (first !== undefined) {
      if (first.charAt(0) === '$') {
        var infs = INFs[first.substr(1)];
        var vars = _unshift_inf(infs, strings, split);

        for (var i = 0; i < vars.length; i++) {
          _replace_infs(pres.slice(), vars[i], INFs, done, split);
        }

        return;

      } else {
        pres.push(first);
        first = strings.shift();
      }
    }

    if (split) { pres = pres.join(split); }
    done.push(pres);
  };
 
  this.replaceInfixes = function(strings, INFs, split) {
    if (split) { strings = strings.split(split); }
    if (!angular.isArray(strings)) { return; }

    var done = [];

    _replace_infs([], strings, INFs, done, split);

    return done;
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
});
