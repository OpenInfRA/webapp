angular.module('oi.app').service('oiAppModal', function ($q, $log, $rootScope, oiUtilView, $window) {
  'use strict';

  var MODAL = angular.element(document.getElementById('oi-app-modals'));
  var STACK = [];

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _push_modal = function(elem, scope) {
    if (STACK.length === 0) { $rootScope.oi.modal = true; } // FIXME

    STACK.push([ elem, scope ]);
    MODAL.append(elem);
  };

  var _find_stack_pos = function(elem) {
    for (var i = 0; i < STACK.length; i++) { // optimize with reverse order
      if (STACK[i][0] === elem) { return i; }
    }

    return;
  };

  var _pop_modal = function(elem) {
    if (STACK.length === 0) { return; }

    var stack;

    if (elem) {
      var pos = _find_stack_pos(elem);
      if (pos === undefined) { return; }

      stack = STACK[pos];
      STACK.splice(pos, 1);

    } else {
      stack = STACK.pop();
    }

    if (!stack) { return; }

    stack[0].remove();   // elem
    stack[1].$destroy(); // $scope
     
    if (STACK.length === 0) { $rootScope.oi.modal = false; }
  };

  /* ------------------------------------------------------------------ */

  var _create_modal = function(elem, defer) {
    return {
      abort : function() {
        _pop_modal(elem);
        defer.reject({ abort : true });
      },

      fulfill : function(args) {
        _pop_modal(elem);
        defer.resolve(args);
      }
    };
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  
  // just load html in container and create modal, no frills

  this.open = function(opts, args) {
    var defer = $q.defer();

    oiUtilView.attach('<div></div>', opts, true, function(elem, scope, locals) {
      var mtop = $window.scrollY + Math.floor($window.innerHeight * 0.15);
          elem.css('margin-top', mtop+'px');

      var modal = _create_modal(elem, defer);

      scope.$modal     = locals.modal     = modal;
      scope.$modalArgs = locals.modalArgs = args;

      _push_modal(elem, scope);
    });

    return defer.promise;
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

});
