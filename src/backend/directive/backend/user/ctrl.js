angular.module('oi.backend').controller('oiBackendPaneUserCtrl', function($scope, $state, $log, oiApp) {
  'use strict';
 
  var back = oiApp.backend;
  var sess = back.session;

  // wir nutzen fuer login und logout die oiApp calls, da damit 
  // app spezifische interaktionen verbunden seien koennen, die
  // uns hier nicht interessieren muessen

  $scope.logout = function() { 
    oiApp.logout().then(function() { $state.go('home', undefined, { reload : true }); });
  };

  $scope.login = function() {
    oiApp.requireLogin().then(function() { $state.go('home', undefined, { reload : true }); });
  };

  function _update_user(user) {
    if (!user) { return; }

    if (user.guest) {
      $scope.username  = 'Gast';
      $scope.userlogin = user.user.login;
      $scope.guest     = true;

    } else {
      $scope.username  = user.user.name;
      $scope.userlogin = user.user.login;
      $scope.guest     = false;
    }
  }

  sess.on('logged_in', function(user) {
    _update_user(user);
  });

  _update_user(sess.user);
});
