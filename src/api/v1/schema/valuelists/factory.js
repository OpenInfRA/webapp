angular.module('oi.api').factory('oiApiV1SchemaValueListsUtilFactory', function ($q, $log, oiApiV1SchemaUtilFactory, oiUtilProtoBuild) {
  'use strict';

  var SUPER = oiApiV1SchemaUtilFactory;

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var oiApiV1SchemaValueListsUtilFactory = function(args) {
    SUPER.call(this, args);
  };

  var proto = oiUtilProtoBuild.inherit(oiApiV1SchemaValueListsUtilFactory, SUPER);

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  var _en = function(de) {
    switch(de) {
      case 'WL_Thema'             : return 'vl_topic';
      case 'WL_Einheit'           : return 'vl_unit';
      case 'WL_Datentyp'          : return 'vl_data_type';
      case 'WL_Beziehungstyp'     : return 'vl_relationship_type';
      case 'WL_SKOSBeziehungsart' : return 'vl_skos_relationship';
    }
  };

  proto.systemLists = function() {
    var lists = {};

    // we can only request de-DE strings for now, to prevent any surprising
    // effects later we explicitly request it for now, so we can be sure there
    // is only once string, and that is german

    return this.cache.enumerate(this.path, { language : 'de-DE' }, function(vl) {
      var name = vl.names.localizedStrings[0].characterString;

      var en = _en(name);
      if (!en) { return; }
 
      lists[en] = vl.uuid;

    }).then(function() {

      return lists;
    });
  };

  proto.dataValueListValues = function(uuid) {
    if (!uuid) { return $q.reject(); }

    var values = [],
        schema = this.shared.schema;

    return this.cache.enumerate(this.path, uuid, 'valuelistvalues', function(data) {
      values.push( schema.simplify('ValueListValue', data) );

    }).then(function() {

      return values;
    });
  };

  proto.dataEnumerateValueListValues = function(uuid, fn, xx) {
    if (!uuid || (typeof(fn) !== 'function')) { return $q.reject(); }

    var that   = this, 
        model  = xx ? 'ValueListValueXX' : 'ValueListValue',
        schema = this.shared.schema;

    return this.cache.enumerate(this.path, uuid, 'valuelistvalues', function(data) {
      fn.call(that, schema.simplify(model, data));
    });
  };

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */

  return oiApiV1SchemaValueListsUtilFactory;
});
