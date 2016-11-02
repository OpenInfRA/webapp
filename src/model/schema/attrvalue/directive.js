angular.module('oi.model').directive('oiSchemaAttrValueData', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attr-value-data="oiModelBaseDataFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttrValueData', { instanceOf : 'oiModelBaseDataFactory', as : '$data' });


}).directive('oiSchemaAttrValueTemp', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attr-value-temp="oiModelBaseDataTempFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttrValueTemp', { instanceOf : 'oiModelBaseDataTempFactory', as : '$temp', templates : 'tempTemplates' });
});
