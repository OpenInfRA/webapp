angular.module('oi.route').controller('oiRouteProjectConfigTopCharAttrEditCtrl', function($q, $log, $scope, $state, oiApp, modelTopChar, tempObject) {
  'use strict';

  var obj = modelTopChar;
  var loc = obj.schema.locales();

  var pn = angular.element( document.querySelector( '#oi-progress' ) );

  /* ------------------------------------------------------------------ */

  $scope.addGroup = function() {
    // select type

    obj.api.util('attributetypegroups').tempPrimer('default').then(function(temp) {
      return $q.when( temp.init() ).then(function() { return temp; });

    }).then(function(temp) {
      oiApp.modal.open('.TPL/modGroup.html', { temp : temp, locales : loc, create : true }).then(function() {
        $scope.busy = true;

        $q.when( tempObject.appendToKey(temp, 'attributeGroups') )['finally'](function() {
          $scope.busy = false;
        });
      });
    });
  };

  $scope.editGroup = function(temp) {
    var t = temp.clone();

    oiApp.modal.open('.TPL/modGroup.html', { temp : t, locales : loc }).then(function() {
      $scope.busy = true;

      $q.when( temp.setData(t) )['finally'](function() {
        $scope.busy = false;
      });
    });
  };

  $scope.hideGroup = function(temp) {
    temp.data.configuration.model.visible = false;
    temp.calcDirty();
    temp.simulateConfiguration();
  };

  $scope.showGroup = function(temp) {
    temp.data.configuration.model.visible = true;
    temp.calcDirty();
    temp.simulateConfiguration();
  };

  $scope.delGroup = function(temp) {
    temp.data.configuration.model.deleted = true;
    temp.calcDirty();
    temp.simulateConfiguration();
  };

  $scope.undelGroup = function(temp) {
    delete(temp.data.configuration.model.deleted);
    temp.calcDirty();
    temp.simulateConfiguration();
  };


  /* ------------------------------------------------------------------ */

  $scope.editAttr = function(temp) {
    var t = temp.clone();

    oiApp.modal.open('.TPL/modAttr.html', { temp : t, locales : loc }).then(function() {
      $scope.busy = true;

      $q.when( temp.setData(t) )['finally'](function() {
        $scope.busy = false;
      });
    });
  };

  $scope.hideAttr = function(temp) {
    temp.data.configuration.model.visible = false;
    temp.calcDirty();
    temp.simulateConfiguration();
  };

  $scope.showAttr = function(temp) {
    temp.data.configuration.model.visible = true;
    temp.calcDirty();
    temp.simulateConfiguration();
  };

  $scope.delAttr = function(temp) {
    temp.data.configuration.model.deleted = true;
    temp.calcDirty();
    temp.simulateConfiguration();
  };

  $scope.undelAttr = function(temp) {
    delete(temp.data.configuration.model.deleted);
    temp.calcDirty();
    temp.simulateConfiguration();
  };


  /* ------------------------------------------------------------------ */

  $scope.abort  = function() { $state.go('^'); };
  $scope.submit = function() { 
    $scope.busy = true;

    obj.dataUpdate(tempObject).then(function() { 
      $state.go('^'); 

    }, function() {}, function(pro) {
      pn.css('width', Math.round(pro*100)+'%');

    })['finally'](function() {
      $scope.busy = false;
    });
  };

  /* ------------------------------------------------------------------ */

  $scope.name = angular.copy(obj.loaded.data.topic.name);
  $scope.temp = tempObject;

  $scope.locales = loc;
});
