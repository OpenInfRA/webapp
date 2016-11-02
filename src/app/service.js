angular.module('oi.app').service('oiApp', function ($q, $log, $rootScope, oiConfig, oiAppModal, oiUtilProto, oiBackendFactory) {
  'use strict';

  this.version = oiConfig.version;
  this.backend = null;

  this.__busy  = 0;

  var load_pbar, load_gate = 0, load_state = false;

  /* ------------------------------------------------------------------ */

  this.on   = oiUtilProto.on;
  this.fire = oiUtilProto.fire;

  this.modal = oiAppModal;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // wir kapseln login/logout damit die app jederzeit das backend wechseln
  // kann, ohne das dritte danach ihre callbacks zu user-changes neu anmelden
  // muessen

  var _logged_in = function(user) {
    this.user = user;
    this.fire('logged_in', user);
  };

  var _logged_out = function() {
    this.fire('logged_out');
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.init = function() {
    var that = this;
    var back = new oiBackendFactory(oiConfig.backend);
 
    load_pbar = $rootScope.oi.progress;

    return back.init().then(function() {
      that.backend = back;
      that.model   = back.model;

      var sess = back.session;
          sess.on({
            'logged_in'  : [ _logged_in,  that ],
            'logged_out' : [ _logged_out, that ]
          });

      var user = that.user = sess.user;

      if (user !== null) { 
        _logged_in.call(that, user); 

      } else {
        return sess.loginGuest();
      }
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.requireLogin = function(args) {
    if (!this.backend) { return $q.reject(); }
    if (this.__require_login) { return this.__require_login; }

    if (!angular.isObject(args)) { args = {}; }

    var that = this;
    var sess = this.backend.session;

    $rootScope.oi.authenticating = true; // to ignore waiting, FIXME

    args.authenticate = function(username, password) { return sess.authenticate(username, password); };

    var opts = {
      templateUrl : '.TPL/modal/require_login/modal.html',
      controller  : 'oiAppModalRequireLoginCtrl'
    };

    var prom = this.__require_login = oiAppModal.open(opts, args)['finally'](function() {
      $rootScope.oi.authenticating = false;
      delete(that.__require_login);
    });

    return prom;
  };

  this.logout = function() {
    if (!this.backend) { return $q.reject(); }

    this.busy();
    var that = this;

    return this.backend.session.loginGuest()['finally'](function() { that.idle(); });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.busy = function() {
    if (!this.__busy) { $rootScope.oi.busy = true; }

    this.__busy++;
  };

  this.idle = function() {
    if (!this.__busy) { return; }

    this.__busy--;
  
    if (!this.__busy) { $rootScope.oi.busy = false; }
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.loading = function(up) {
    if (up === true) {
      load_gate++;

      if (load_gate && !load_state) {
        load_state = true;

        load_pbar.active  = true;
        load_pbar.loading = true;
      }

    } else if (up === false) {
      if (load_gate) {
        load_gate--;

        if (!load_gate && load_state) {
          load_state = false;

          load_pbar.active  = false;
          load_pbar.loading = false;
        }
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

});
