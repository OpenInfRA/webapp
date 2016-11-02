angular.module('oi.model').directive('oiSchemaTopInstData', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-top-inst-data="oiModelBaseDataFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaTopInstData', { instanceOf : 'oiModelBaseDataFactory', key : 'data' });

}).directive('oiSchemaTopInstTemp', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-top-inst-temp="oiModelBaseDataTempFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaTopInstTemp', { instanceOf : 'oiModelBaseDataTempFactory', key : 'temp' });

}).directive('oiSchemaTopInstList', function(oiDirective) {
  'use strict';

  // <ANY oi-schema-top-inst-temp="oiModelBaseDataListFactory" [ oi-view="<template-key>" ]/>
  return oiDirective.buildDataDirective('oiSchemaTopInstList', { instanceOf : 'oiModelBaseDataListFactory', key : 'list' });
});
