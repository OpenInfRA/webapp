angular.module('oi.directive').service('oiDirective', function ($q, $log, $injector, $templateCache, $compile, oiDirectiveTemplate, oiUtilView) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _true = function() { return true; };

  var _io_fn = function(io) {
    if (angular.isArray(io)) {
      if (!io.length) { return _true; }

      for (var i in io) {
        io[i] = $injector.get(io[i], 'oiDirective');
      }

      return function(val) {
        for (var i in io) {
          if (val instanceof io[i]) { return true; }
        }

        return false;
      };
    }

    var tfn = typeof(io);
    if (tfn === 'function') { return io; }

    if (tfn === 'string') {
      var FN = $injector.get(io, 'oiDirective');

      return function(val) { return val instanceof FN; };
    }

    return function() { return _true; };
  };

  var _fn_test = function(key, args) {
    var test = args.test;
    if (typeof(test) === 'function') { return test; }

    var io = args.instanceOf;
    if (io) {
      var fn;

      return function(val) {
        if (!fn) { fn = _io_fn(io); } // erst ermitteln, wenn gebraucht!

        if (fn(val)) { return true; }

        $log.error('directive', key, 'expecting object of', io, 'got', val);
        return false;
      };
    }

    return;
  };

  var _fn_can_init = function(key, args) {
    var fn_test = _fn_test(key, args);

    if (!fn_test) { 
      return function(val) { return !val; };
    }

    return function(val) {
      if (!val) { return; }
      return fn_test(val);
    };
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  
  // the directive waits for the first positive change of
  // the key value to initialize the directive; further changes
  // are ignored and will not reload oder replace the directive
  // content and scope
  //
  // the init-function can manipulate the scope and needs to
  // return the url of the template that will be loaded into
  // the directive

  this.buildTemplateDirective = function(key, args, fn_init) {
    if (typeof(key) !== 'string') { return; }

    if (typeof(args) === 'function') {
      fn_init = args;
      args = {};

    } else if (!angular.isObject(args)) {
      args = {};
    }
  
    var can_init = _fn_can_init(key, args);
    var restrict = args.restrict || 'A';

    var ret = {
      restrict : restrict,
      scope : {},

      link : function(scope, elem, attrs) { 
        var oConts, oScope, nScope,
            pScope = scope.$parent,
            oiView = attrs.oiView,
            oldVal;

        // we create a private fuction, to load a url into
        // the directive; this 

        var use_tpl = function(opts, fn_init_scope) {
          oiUtilView.attach(elem, opts, function(elem, scope, locals) {
            if (!nScope) { nScope = pScope.$new(); }

            scope = nScope;

            if (fn_init_scope && (typeof(fn_init_scope) === 'function')) {
              try {
                fn_init_scope(scope, locals, attrs);
 
              } catch(e) {
                $log.log('failed template scope initialization', e);
              }
            }

            oConts = elem.contents();

            oScope = scope;
            nScope = undefined;

            return scope;
          });
        };

        scope.$watch(key, function(val) {
          if (val === oldVal) { return; }
          oldVal = val;

          if (oConts) { oConts.remove();   }
          if (oScope) { oScope.$destroy(); }

          if (!can_init(val)) { return; }

          fn_init(val, oiView, use_tpl);
        });
      }
    };

    ret.scope[key] = '=';

    return ret;
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _expand_data_args = function(args) {
    var key = args.key;
    if (key) {
      if (!('templates' in args)) { args.templates = key+'Templates'; }
      if (!('as'        in args)) { args.as        = '$'+key; }
    }
  };

  var _def_url = function(def, key, view) {
    if (!def) { return; }

    var tpl = def[key];
    if (!tpl) { return; }

    if (view) { return tpl[view]; }

    return tpl.view;
  };

  this.buildDataDirective = function(key, args) {
    if (!angular.isObject(args)) { args = {}; }

    _expand_data_args(args);

    var as = args.as;
    var tk = args.templates || 'dataTemplates';

    return this.buildTemplateDirective(key, args, function(obj, view, use_tpl) {
      var init;
      if (typeof(obj.init) === 'function') { init = obj.init(); }

      return $q.when(init)['catch'](function(err) {
        $log.error('directive', key, 'init data model failed', err);

      }).then(function() {
        var url = _def_url(obj.definition, tk, view);

        use_tpl(url, function(scope, locals, attrs) { 
          if (!as) { as = attrs.$normalize(key); }

          scope[as] = locals[as] = obj;
        }, obj);
      });
    });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.buildReloadDirective = function(key, opts) {
    if (!angular.isObject(opts)) { opts = {}; }

    var ofn = opts.instanceOf;
    var tpl = opts.template;

    var ret = {
      restrict : 'A',
      scope    : {},

      link : function($scope, $elem) {
        var oContent, oScope, 
            html   = $templateCache.get(tpl),
            pScope = $scope.$parent;

        $scope.$watch(key, function(new_obj, old_obj) {
          if (old_obj === new_obj) { return; }

          if (new_obj && ofn && !(new_obj instanceof ofn)) { 
            $log.error('directive '+key, 'expecting object of', ofn, 'got', new_obj);
            new_obj = undefined;
          }

          if (oContent) { oContent.remove(); }
          if (oScope)   { oScope.$destroy(); }

          if (new_obj) {
            var nScope = pScope.$new();
                nScope.model = new_obj;

            $elem.html(html);

            oContent = $compile($elem.contents())(nScope);
            oScope   = nScope;

          } else {
            oContent = oScope = undefined;
          }
        });
      }
    };

    ret.scope[key] = '=';

    return ret;
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

});
