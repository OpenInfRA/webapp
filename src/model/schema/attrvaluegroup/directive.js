angular.module('oi.model').directive('oiSchemaAttrValueGroupData', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attr-value-group-data="oiModelBaseDataFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttrValueGroupData', { instanceOf : 'oiModelBaseDataFactory', as : '$data' });


}).directive('oiSchemaAttrValueGroupTemp', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attr-value-group-temp="oiModelBaseDataTempFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttrValueGroupTemp', { instanceOf : 'oiModelBaseDataTempFactory', as : '$temp', templates : 'tempTemplates' });
});
