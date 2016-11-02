angular.module('oi').controller('oiAppModalRequireLoginCtrl', function($log, $scope, modal, modalArgs, oiConfig) {
  'use strict';

  var fn_auth = modalArgs.authenticate;

  var form = {};

  $scope.submit = function() {
    $scope.authorizing = true;

    fn_auth(form.username, form.password).then(function() {
      $log.log('user logged in!');

      form.username = '';
      form.password = '';

      modal.fulfill();

    }, function(err) {
      $log.log('login error', err);

    })['finally'](function() {
      $scope.authorizing = false;
    });
  };

  $scope.useLogin = function(login) {
    form.username = login;
    form.password = login;

    $scope.submit();
  };

  $scope.form = form;

  var sess = oiConfig.session;
  if (angular.isObject(sess)) {
    var test_logins = sess.testLogins;
    if (angular.isArray(test_logins)) {
      test_logins = test_logins.slice();

      test_logins.sort();
      test_logins.unshift('root');

      $scope.testLogins = test_logins;
    }
  }
});
