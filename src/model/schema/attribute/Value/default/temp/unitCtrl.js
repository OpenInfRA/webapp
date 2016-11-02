angular.module('oi.model').controller('oiModelSchemaAttributeUnitCtrl', function($q, $log, $scope) {
  'use strict';


  var temp = $scope.$temp,
      util = temp.schema.getModelUtil('ValueList');

  var unit = $scope.unit = {
    value   : undefined,
    options : [],
    loading : true,
    changed : function() {
      if (unit.value) {
        temp.data.attributeType.unit = unit.lookup[unit.value];
 
      } else {
        temp.data.attributeType.unit = null;
      }
    }
  };

  var aTU = temp.data.attributeType.unit;
  if (aTU) {
    unit.value   = aTU.uuid;
    unit.options = [ aTU ];
  }

  util.systemList('vl_unit').then(function(data) {
    var list    = data.keys.slice(0);
    unit.lookup = data.values;

    list.sort(function(a,b) { return a.name.localeCompare(b.name); });
    
    unit.options = list;
    unit.loading = false;
  });
});
