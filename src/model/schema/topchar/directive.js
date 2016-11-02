angular.module('oi.model').directive('oiSchemaTopCharData', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-top-char-data="oiModelBaseDataConfFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaTopCharData', { instanceOf : 'oiModelBaseDataConfFactory', as : '$data' });


}).directive('oiSchemaTopCharTemp', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-top-char-temp="oiModelBaseDataConfTempFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaTopCharTemp', { instanceOf : 'oiModelBaseDataConfTempFactory', as : '$temp', templates : 'tempTemplates' });
});
