angular.module('oi.util').service('oiUtilView', function ($q, $log, $templateCache, $compile, $rootScope, $controller) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
 
  var _html = function(opts) {
    return opts.template || $templateCache.get(opts.templateUrl);
  };

  var _attach = function(elem, opts, scope, locals) {
    var link = $compile(elem.contents());

    locals.$scope   = scope;
    locals.$element = elem;

    if (opts.controller) {
      var ctrl = $controller(opts.controller, locals); 

      if (opts.controllerAs) { 
        scope[opts.controllerAs] = ctrl;
      }

      if (angular.isFunction(ctrl.$onInit)) { ctrl.$onInit(); }

      elem.data('$ngControllerController', ctrl);
      elem.children().data('$ngControllerController', ctrl);
    }
 
    link(scope);

    return scope;
  };

  this.attach = function(elem, opts, scope, init) {
    if (typeof(opts) === 'string') {
      opts = { templateUrl : opts };

    } else if (!angular.isObject(opts)) {
      return $q.reject({ reason : 'invalid options' });
    }
 
    var html = _html(opts);
    if (!html) { 
      return $q.reject({ reason : 'no html' });
    }

    if (typeof(elem) === 'string') {
      elem = angular.element(elem);
      if (!elem) { return $q.reject({ reason : 'element creation failed' }); }

    } else if (!angular.isElement(elem)) {
      return $q.reject({ reason : 'no element' });
    }

    elem.html(html);

    if (typeof(scope) === 'function') {
      init  = scope;
      scope = undefined;

    } else if (typeof(init) !== 'function') {
      init = undefined;
    }

    if (scope === true) {
      scope = $rootScope.$new();
    }

    var locals = {};

    if (!init) { return _attach(elem, opts, scope, locals); }

    $q.when( init(elem, scope, locals) ).then(function(iscope) {
      scope = iscope || scope;
      if (!scope) { return $q.reject({ reason : 'no scope' }); }

      return _attach(elem, opts, scope, locals);
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
});
