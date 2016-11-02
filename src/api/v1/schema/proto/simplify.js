angular.module('oi.api').service('oiApiV1SchemaProtoSimplify', function ($q, $log) {
  'use strict';

  var proto = this.proto = {};

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _create_lookup = function(list, key) {
    if (!angular.isArray(list)) { return {}; }

    var look = {};

    angular.forEach(list, function(item) {
      var val = item[key];
      if (val === undefined) { return; }

      look[val] = item;
    });

    return look;
  };

  var _values = function(object) {
    var vals = [];

    angular.forEach(object, function(val) { vals.push(val); });

    return vals;
  };

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _apify_localized_string = function(ptf, from, to, data, base) {
    if (!(data && (from in data))) { return; }

    var dfrom = data[from];
    var bto   = base ? base[to] : undefined;

    return $q.when(ptf.buildLocalized(dfrom, bto)).then(function(localized) {
      if (!localized) { return $q.reject({ reason : 'create localized string failed' }); }

      data[to] = localized;
      delete(data[from]);
    });
  };


  // ------------------------------------------------------------------

  var _simplify_mult = function(data) {
    if (!data) { return; }

    return [ data.min, data.max ];
  };

  var _apify_mult = function(help, key, data, base) {
    if (!(data && (key in data))) { return; }

    var mult = help[2];

    var vdata = data[key];
    var vbase = base[key];

    return $q.when(mult.resolveMultiplicity(vdata, vbase)).then(function(ds) { 
      if (!ds) { return $q.reject({ reason : 'no multiplicity resolved' }); }

      data[key] = ds;
    });
  };


  // ------------------------------------------------------------------

  var _simplify_valuelist = function(ptf, data) { 
    if (!data) { return null; }

    return {
      uuid        : data.uuid,
      name        : ptf.simplifyLocalized(data.names), 
      description : ptf.simplifyLocalized(data.descriptions)
    };
  };

  var _apify_valuelist = function(help, key, data, base) {
    if (!data) { return; }

    var vdata = data[key];
    if (!vdata) { return; }

    var vbase = base[key] || {};

    if (vdata.uuid === vbase.uuid) { 
      data[key] = vbase;
      return;
    }
  
    return help[0].read('valuelists', vdata.uuid).then(function(data) {
      data[key] = data;
      return;
    });
  };


  // ------------------------------------------------------------------

  var _simplify_valuelistvalue = function(ptf, data, xx) { 
    if (!data) { return null; }

    return {
      uuid        : data.uuid,
      name        : xx ? ptf.simpleString(data.names) : ptf.simplifyLocalized(data.names), 
      description : ptf.simplifyLocalized(data.descriptions),
      visibility  : data.visibility
    };
  };

  var _update_valuelistvalue = function(help, data, base) {
    var wait = [];

    wait.push(_apify_localized_string(help[1], 'name',        'names',        data, base));
    wait.push(_apify_localized_string(help[1], 'description', 'descriptions', data, base));

    return $q.all(wait);
  };

  var _apify_valuelistvalue = function(help, key, data, base, update, xx) {
    if (!data) { return; }

    var vdata = data[key];
    if (!vdata) { return; }

    var vbase = base[key] || {};

    if (vbase.uuid && angular.equals(vdata, _simplify_valuelistvalue(help[1], vbase, xx))) { 
      data[key] = vbase;
      return;
    }

    if (update) {
      if (vdata.uuid === vbase.uuid) { 
        // bekannte basis nutzen um strings zu erstellen
        return _update_valuelistvalue(help, vdata, vbase);

      } else if (vdata.uuid) {
        // neue basis laden um strings zu erstellen
        return help[0].read('valuelistvalues', vdata.uuid).then(function(base) {
          return _update_valuelistvalue(help, vdata, base);
        });

      } else {
        // leeren value erzeugen
        return _update_valuelistvalue(help, vdata, {});
      }
    }

    if (vdata.uuid === vbase.uuid) {
      data[key] = vbase;
      return;
    }
 
    return help[0].read('valuelistvalues', vdata.uuid).then(function(value) {
      data[key] = value;
      return;
    });
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_attrtype = function(ptf, data) {
    if (!data) { return; }

    return {
      uuid : data.uuid,
 
      name        : ptf.simplifyLocalized(data.names), 
      description : ptf.simplifyLocalized(data.descriptions),

      type   : data.type,
      domain : _simplify_valuelist(ptf, data.domain),

      dataType : _simplify_valuelistvalue(ptf, data.dataType, true),
      unit     : _simplify_valuelistvalue(ptf, data.unit,     true)
    };
  };

  var _apify_attrtype = function(help, key, data, base) {
    if (!(data && (key in data))) { return; }

    var vdata = data[key];
    var vbase = base[key] || {};

    if (vbase.uuid && angular.equals(vdata, _simplify_attrtype(help[1], vbase))) { 
      data[key] = vbase;
      return;
    }

    var ptf = help[1];
    var wait = [];

    wait.push(_apify_localized_string(ptf, 'name',        'names',        vdata, vbase));
    wait.push(_apify_localized_string(ptf, 'description', 'descriptions', vdata, vbase));
    
    wait.push(_apify_valuelist(help, 'domain',   vdata, vbase));

    wait.push(_apify_valuelistvalue(help, 'dataType', vdata, vbase, false, true));
    wait.push(_apify_valuelistvalue(help, 'unit',     vdata, vbase, false, true));

    return $q.all(wait).then(function() { return data; });
  };


  // ------------------------------------------------------------------

  var _simplify_attrtypegroup = function(ptf, data) {
    if (!data) { return; }

    return {
      uuid        : data.uuid,
      name        : ptf.simplifyLocalized(data.names), 
      description : ptf.simplifyLocalized(data.descriptions)
    };
  };

  var _apify_attrtypegroup = function(help, key, data, base) {
    if (!(data && (key in data))) { return; }

    var vdata = data[key];
    var vbase = base[key] || {};

    if (vbase.uuid && angular.equals(vdata, _simplify_attrtypegroup(help[1], vbase))) { 
      data[key] = vbase;
      return;
    }

    var ptf = help[1];
    var wait = [];

    wait.push(_apify_localized_string(ptf, 'name',        'names',        vdata, vbase));
    wait.push(_apify_localized_string(ptf, 'description', 'descriptions', vdata, vbase));

    return $q.all(wait).then(function() { return data; });
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_attribute = function(help, data) {
    var ptf = help[1];

    var simp = {
      uuid  : data.uuid,
      order : data.order,

      configuration : data.configuration,
 
      attributeTypeGroupId : data.attributeTypeGroupId, // for easier move detection

      multiplicity  : _simplify_mult(data.multiplicity),
      attributeType : _simplify_attrtype(ptf, data.attributeType),

      defaultValue : _simplify_valuelistvalue(ptf, data.defaultValue)
    };

    return simp;
  };

  var _apify_attribute = function(help, data, base) {
    if (!angular.isObject(base)) { base = {}; }

    if (base.uuid && angular.equals(data, _simplify_attribute(help, base))) { return base; }

    var wait = [];

    wait.push(_apify_mult(          help, 'multiplicity',  data, base));
    wait.push(_apify_attrtype(      help, 'attributeType', data, base));

    wait.push(_apify_valuelistvalue(help, 'defaultValue',  data, base));

    return $q.all(wait).then(function() { return data; });
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_attrgroup = function(help, data) {
    var ptf = help[1];

    var simp = {
      uuid  : data.uuid,
      order : data.order,

      configuration : data.configuration,

      multiplicity       : _simplify_mult(data.multiplicity),
      attributeTypeGroup : _simplify_attrtypegroup(ptf, data.attributeTypeGroup)
    };

    if ('attributes' in data) {
      var list = [];

      angular.forEach(data.attributes, function(attr) {
        list.push(_simplify_attribute(help, attr));
      });

      simp.attributes = list;
    }

    return simp;
  };

  var _apify_attrgroup = function(help, data, base, glook) {
    if (!angular.isObject(base)) { base = {}; }

    // if we use the global attribute lookup, we must not bypass this
    // stage to account for every attribut!

    if (!glook && base.uuid && angular.equals(data, _simplify_attrgroup(help, base))) { return base; }

    var wait = [];

    wait.push(_apify_mult(         help, 'multiplicity',       data, base));
    wait.push(_apify_attrtypegroup(help, 'attributeTypeGroup', data, base));

    if ('attributes' in data) {
      var look = glook || _create_lookup(base.attributes, 'uuid');
      var list = [];

      angular.forEach(data.attributes, function(idata, i) {
        var ibase, uuid = idata.uuid;

        if (uuid) {
          ibase = look[uuid]; 
           delete(look[uuid]);
        }

        idata.order = i;

        var when = $q.when(_apify_attribute(help, idata, ibase)).then(function(data) {
          list[i] = data;
        });

        wait.push(when);
      });

      data.attributes = list;

      if (!glook) {
        var gone = _values(look);
        if (gone.length) { 
          data.attributesGone = gone;
        }
      }
    }

    return $q.all(wait).then(function() { return data; });
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_topchar = function(help, data) {
    var ptf = help[1];

    var simp = {
      uuid : data.uuid,
      configuration : data.configuration,

      description : ptf.simplifyLocalized(data.descriptions),

      topic : _simplify_valuelistvalue(ptf, data.topic),

      topicInstancesCount : data.topicInstancesCount
    };

    if ('attributeGroups' in data) {
      var list = [];

      angular.forEach(data.attributeGroups, function(ag) {
        list.push(_simplify_attrgroup(help, ag));
      });

      simp.attributeGroups = list;
    }

    return simp;
  };

  var _apify_topchar = function(help, data, base) {
    if (!angular.isObject(base)) { base = {}; }

    if (base.uuid && angular.equals(data, _simplify_topchar(help, base))) { return base; }

    var wait = [];

    wait.push(_apify_localized_string(help[1], 'description', 'descriptions', data, base));
    wait.push(_apify_valuelistvalue(help, 'topic', data, base, true));

    if ('attributeGroups' in data) {
      var lats = {};

      angular.forEach(base.attributeGroups, function(ag) {
        var ats = ag.attributes;
        if (!ats) { return; }

        angular.extend(lats, _create_lookup(ats, 'uuid'));
      });

      // lats is now a lookup for all attributes within all groups

      var look = _create_lookup(base.attributeGroups, 'uuid');
      var list = [];

      angular.forEach(data.attributeGroups, function(idata, i) {
        var ibase, uuid = idata.uuid;

        if (uuid) {
          ibase = look[uuid]; 
           delete(look[uuid]);
        }

        idata.order = i;

        var when = $q.when(_apify_attrgroup(help, idata, ibase, lats)).then(function(data) {
          list[i] = data;
        });

        wait.push(when);
      });

      data.attributeGroups = list;

      var gone = _values(look);
      if (gone.length) { 
        data.attributeGroupsGone = gone;
      }

      gone = _values(lats);
      if (gone.length) { 
        data.attributesGone = gone;
      }
    }

    return $q.all(wait).then(function() { return data; });
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_av_value = function(help, data) {
    return help[1].simplifyLocalized(data.value);
  };

  var _simplify_av_domain = function(help, data) {
    return _simplify_valuelistvalue(help[1], data.domain);
  };

  var _simplify_attrvalvalue = function(help, data) {
    switch (data.attributeValueType) {
      case 'ATTRIBUTE_VALUE_VALUE'  : return _simplify_av_value( help, data.attributeValueValue); 
      case 'ATTRIBUTE_VALUE_DOMAIN' : return _simplify_av_domain(help, data.attributeValueDomain); 
      case 'ATTRIBUTE_VALUE_GEOM'   : return data.attributeValueGeom.geom;
      case 'ATTRIBUTE_VALUE_GEOMZ'  : return data.attributeValueGeomz.geom;
    }

    return data;
  };

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_attrvalue = function(help, data) {
    var simp = {
      attribute : data.attribute
    };

    if ('values' in data) {
      var list = [];

      angular.forEach(data.values, function(v) {
        list.push(_simplify_attrvalvalue(help, v));
      });

      simp.values = list;
    }

    return simp;
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_attrvalgroup = function(help, data) {
    var simp = {
      attributeGroup : data.attributeGroup
    };

    if ('attributeValues' in data) {
      var list = [];

      angular.forEach(data.attributeValues, function(av) {
        list.push(_simplify_attrvalue(help, av));
      });

      simp.attributeValues = list;
    }

    return simp;
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify_topinst = function(help, data) {
    var simp = {
      uuid : data.uuid
    };

    if ('topicCharacteristic' in data) {
      simp.topicCharacteristic = _simplify_topchar(help, data.topicCharacteristic);
    }

    if ('attributeValueGroups' in data) {
      var list = [];

      angular.forEach(data.attributeValueGroups, function(avg) {
        list.push(_simplify_attrvalgroup(help, avg));
      });

      simp.attributeValueGroups = list;
    }

    if ('values' in data) {
      var vals = {};

      angular.forEach(data.values, function(val) {
        var uuid = val.attributeTypeId,
            simp = _simplify_attrvalvalue(help, val);
        
        vals[uuid] = simp;
      });

      simp.values = vals;
    }
    
    return simp;
  };

  var _simplify_association = function(help, data) {
    var simp;

    if (data.associationInstance) {
      simp = _simplify_topinst(help, data.associationInstance);

      simp.$associatedUuid       = data.uuid;
      simp.$associatedInstanceId = data.associatedInstanceId;

    } else {
      simp = _simplify_topinst(help, data.associatedInstance);

      simp.$associationUuid       = data.uuid;
      simp.$associationInstanceId = data.associationInstanceId;
    }

    return simp;
  };


  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  var _simplify = function(help, model, data) {
    switch (model) {
      case 'TopicCharacteristic' : return _simplify_topchar(  help, data); 
      case 'AttributeGroup'      : return _simplify_attrgroup(help, data);
      case 'Attribute'           : return _simplify_attribute(help, data);

      case 'TopicInstance'       : return _simplify_topinst(     help, data); 
      case 'AttributeValueGroup' : return _simplify_attrvalgroup(help, data);
      case 'AttributeValue'      : return _simplify_attrvalue(   help, data);
      case 'AttributeValueValue' : return _simplify_attrvalvalue(help, data);

      case 'Association'         : return _simplify_association( help, data); 

      case 'ValueList'		 : return _simplify_valuelist(help[1], data);

      case 'ValueListValue'      : return _simplify_valuelistvalue(help[1], data);
      case 'ValueListValueXX'    : return _simplify_valuelistvalue(help[1], data, true);
    }

    return data; 
  };

  proto.simplify = function(model, data) {
    if (data.$simplified) { return data; }

    var help = [
      this,
      this.shared.ptfreetext,
      this.shared.multiplicities
    ];

    data = _simplify(help, model, data);
    data.$simplified = true;

    return data;
  };

  proto.simplifyList = function(model, list) {
    if (!model && !angular.isArray(list)) { return; }

    var help = [
      this,
      this.shared.ptfreetext,
      this.shared.multiplicities
    ];

    var out  = [];
    var wait = [];

    angular.forEach(list, function(data, i) {
      if (data.$simplified) {
        out[i] = data;

      } else {
        var when = $q.when( _simplify(help, model, data) ).then(function(data) {
          data.$simplified = true;
          out[i] = data;
        });
 
        wait.push(when);
      }
    });

    return $q.all(wait).then(function() { return out; });
  };

  proto.apify = function(model, data, base) {
    var help = [
      this,
      this.shared.ptfreetext,
      this.shared.multiplicities
    ];

    switch (model) {
      case 'TopicCharacteristic' : return _apify_topchar(  help, data, base); 
      case 'AttributeGroup'      : return _apify_attrgroup(help, data, base);
      case 'Attribute'           : return _apify_attribute(help, data, base);

      case 'ValueList'		 : return _apify_valuelist(help, data, base);
    }

    return data;
  };

});
