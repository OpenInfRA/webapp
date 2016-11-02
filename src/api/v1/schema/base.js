angular.module('oi.api').service('oiApiV1SchemaBase', function ($q, $log, oiUtilProtoBuild, oiUtilObject, oiApiV1SchemaProtoSimplify) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  this.create = function(that) {
    that.shared.schema = that;

    that.shared.attributes     = that.util('attributetypesattributetypegroupsassociations');
    that.shared.topchars       = that.util('topiccharacteristics');
    that.shared.metadata       = that.util('metadata');
    that.shared.ptlocales      = that.util('ptlocales');
    that.shared.ptfreetext     = that.util('ptfreetext');
    that.shared.valuelists     = that.util('valuelists');
    that.shared.multiplicities = that.util('multiplicities');
  };

  this.init = function(that) {
    var init = [
      that.shared.ptlocales.init(),
      that.shared.ptfreetext.init(),
      that.shared.multiplicities.init()
    ];

    return $q.all(init);
  };

  var proto = this.proto = angular.extend({}, 
    oiApiV1SchemaProtoSimplify.proto
  );

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  proto.primer = function(primer, lang) {
    if (typeof(primer) !== 'string') { return {}; }
    var query = { pojoClass : primer };

    if (typeof(lang) === 'string') { query.language = lang; }

    return this.rest.get([ this.path, 'primer' ], query);
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  // kleines hilfs objekt, das u.a. input directiven die verfuegbaren
  // locales bereitstellt und die aktuell selektierte input locale entaehlt

  proto.locales = oiUtilProtoBuild.once('locales', function() {
    return oiUtilObject.create('oiApiV1SchemaLocalesFactory', { api : this.shared.ptlocales });
  });

});
