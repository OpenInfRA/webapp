angular.module('oi.model').filter('oiModelSchemaAttrValueValueBoolean', function() {
  'use strict';

  return function(value) {
    return (value === 'false') ? '\u2718' : '\u2713';
  };
});
