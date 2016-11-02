angular.module('oi.model').directive('oiSchemaAttrGroupData', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attr-group-data="oiModelBaseDataConfFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttrGroupData', { instanceOf : 'oiModelBaseDataConfFactory', as : '$data' });


}).directive('oiSchemaAttrGroupTemp', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attr-group-temp="oiModelBaseDataConfTempFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttrGroupTemp', { instanceOf : 'oiModelBaseDataConfTempFactory', as : '$temp', templates : 'tempTemplates' });
});
