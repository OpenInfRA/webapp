angular.module('oi.model').directive('oiSchemaAttributeData', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attribute-data="oiModelBaseDataConfFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttributeData', { instanceOf : 'oiModelBaseDataConfFactory', as : '$data' });


}).directive('oiSchemaAttributeTemp', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-attribute-temp="oiModelBaseDataConfTempFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaAttributeTemp', { instanceOf : 'oiModelBaseDataConfTempFactory', as : '$temp', templates : 'tempTemplates' });
});
