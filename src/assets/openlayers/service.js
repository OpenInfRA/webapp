angular.module('oi.').service('oiAssetsOpenLayers', function ($log, oiAssets) {
  'use strict';

  var INIT;

  var _init = function() {
    if (!INIT) {
      INIT = oiAssets.loadLate(
        'OpenLayers.light.js',
        'proj4js-combined.min.js',
        'proj4js-openinfra.js'
      );
    }

    return INIT;
  };

  var _create_preview = function(id, geoJson) {
    var map = new OpenLayers.Map(id, { 
      theme : null,
      projection : 'EPSG:900913',
      layers :   [ new OpenLayers.Layer.OSM() ],
      controls : [ new OpenLayers.Control.Attribution() ]
    });

    var format = new OpenLayers.Format.GeoJSON();
    var features = format.read(geoJson);

    // extract crs from geoJson if provided otherwise EPSG:4326 is assumed
    // crs is assumed to be in short notation
    // Important: CRS/SRID needs to be defined as OL projection for transform

    var crs = 'EPSG:4326';

    if (geoJson.crs && geoJson.crs.type === 'name') {
      crs = geoJson.crs.properties.name;
    }

    // transfrom to Sperical Mercator (OSM base layer projection)
    features.forEach(function(f) {
      f.geometry.transform(crs, 'EPSG:900913');
    });

    var layer = new OpenLayers.Layer.Vector('Preview');
        layer.addFeatures(features);

    map.addLayer(layer);
    map.zoomToExtent(layer.getDataExtent());

    return map;
  };

  // ------------------------------------------------------------------

  this.init = function() { 
    return _init(); 
  };

  this.createPreview = function(id, geoJson) {
    return _init().then(function() { 
      return _create_preview(id, geoJson); 
    });
  };
});
