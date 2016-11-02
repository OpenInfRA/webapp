angular.module('oi.backend').factory('oiBackendSessionFactory', function ($http, $q, $log, oiUtilUrl, oiUtilProto) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiUtilSessionFactory = function(args) {
    if (!angular.isObject(args)) { args = {}; }

    this.url = args.base;

    if (angular.isArray(args.guest)) {
      this.guest = args.guest;
    }

    this.user = undefined;
  };

  var proto = oiUtilSessionFactory.prototype;

  proto.on   = oiUtilProto.on;
  proto.fire = oiUtilProto.fire;

  var _user_agent  = 'OpenInfraSession';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _ua_get = function(that, url) {
    return $http.get(that.url+url, { headers : { 'User-Agent' : _user_agent } });
  };

  var _http_self = function(that) {
    return _ua_get(that, '/rest/v1/rbac/subjects/self.json').then(function(res) { return res.data; });
  };

  var _http_perm = function(that) {
    return _ua_get(that, '/rest/v1/rbac/subjects/self/permissions.json').then(function(res) { return res.data; });
  };

  var _load_self_perm = function(that) {
    return _http_self(that).then(function(user) {
      if (!angular.isObject(user) || !user.login) { return $q.reject(); }

      var guest = false;
      if (that.guest && (user.login === that.guest[0])) { guest = true; }

      return $q.all({
        user  : user,
        perm  : _http_perm(that),
        guest : guest
      });
    });
  };

  var _initial_user = function(that) {
    return _load_self_perm(that)['catch'](function() { return null; });
  };

  // current user fragt ab, welcher nutzer gerade aktiv ist und feuert 
  // entsprechend, wenn sich eine aenderung zum gesetzten zustand ergibt
  // (voellig unabhaengig davon, ob der gewuenschte nutzer angemeldet ist
  //  oder irgendwas anderes geplant war!)
  // wenn kein nutzer bestimmt werden konnte, gibt es bewusst ein reject

  var _current_user = function(that) {
    return _load_self_perm(that).then(function(load) {
      that.user = load;
      return load;

    }, function() {
      that.user = null;
      return $q.reject();
    });
  };

  // wir pruefen ob der aktuelle nutzer der gewuenschte ist, resp.
  // kein aktueller nutzer existiert

  var _expect_user = function(that, expect) {
    return _current_user(that).then(function(user) {
      if (user.user.login !== expect) { return $q.reject(); }
      return user;

    }, function() {
      if (expect !== null) { return $q.reject(); }
      return null;
    });
  };

  /* ------------------------------------------------------------------ */

  var _fire = function(that, old_user) {
    var new_user = that.user;

    if (new_user === old_user) { return; }

    if (new_user) {
      if (!old_user || (old_user.user.login !== new_user.user.login)) {
        that.fire('logged_in', new_user);
      }

    } else if (old_user) {
      that.fire('logged_out');
    }
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.init = function() { 
    var that = this;

    return _initial_user(this).then(function(user) {
      that.user = user; // can be null!
      return user;
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _http_logout = function(that) {
    return _ua_get(that, '/logout');
  };

  var _logout = function(that) {
    // egal was der server meldet, wir testen in beiden faellen ob die
    // session wirklich nicht mehr funktioniert

    return _http_logout(that).then(function() {
      return _expect_user(that, null);

    }, function() {
      return _expect_user(that, null);
    });
  };

  proto.logout = function() { 
    var that = this;
    var user = this.user;
 
    return _logout(this)['finally'](function() { _fire(that, user); });
  };


  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _http_login = function(that, username, password) {
    return $http({
      method  : 'POST',
      url     : that.url+'/login.jsp',
      data    : { username : username, password: password, submit : 'Login' },
      headers : {'Content-Type' : 'application/x-www-form-urlencoded', 
                 'User-Agent'   : _user_agent },
      transformRequest: oiUtilUrl.queryString

    })['catch'](function(res) {
      if (res.status === 415) { return $q.resolve(); }
      return $q.reject();
    });
  };

  var _login = function(that, username, password) {
    return _http_login(that, username, password).then(function() {
      return _expect_user(that, username);
    });
  };

  proto.loginWithCredentials = function(username, password) {
    if (!username && password) { return $q.reject(); }

    var that = this;
    var user = this.user;

    return _logout(that).then(function() {
      return _login(that, username, password);

    })['finally'](function() { _fire(that, user); });
  };

  proto.loginGuest = function() { 
    var guest = this.guest;
    if (!guest) { return $q.reject(); }

    return this.loginWithCredentials(guest[0], guest[1]);
  };

  // helper fn for requireLogin modal

  proto.authenticate = function(username, password) {
    // normal login but without user return
    return this.loginWithCredentials(username, password).then(function() { return; });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiUtilSessionFactory;
});
