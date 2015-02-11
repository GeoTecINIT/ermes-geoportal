/*
  The imageservices.js file loads raster file from ImageService
*/

/*global define */    // Jshint option to indicate global objects
(function() {
  'use strict';

  define([
    "esri/layers/ArcGISImageServiceLayer", 
    "esri/layers/ImageServiceParameters", 
    "esri/layers/MosaicRule", 
    "dojo/_base/array", 
    "dojo/_base/json", 
  ], function(ArcGISImageServiceLayer, ImageServiceParameters, MosaicRule, array, json) {


    function _loadRasterLayer(rasterId) {
      
    }

    function _loadServices(config) {
      var layers = [];

      var ndviLayerURL = "http://ermes.dlsi.uji.es:6080/arcgis/rest/services/Prototype/Italy_NDVI_2014/ImageServer";

      // Define image service parameters
      var params = new ImageServiceParameters();
      var mr = new MosaicRule();
      mr.method = MosaicRule.METHOD_LOCKRASTER;
      console.debug("lockRasterIds: " +  mr.lockRasterIds)
      mr.lockRasterIds = [41];   // Only accesss to raster id 5
      params.mosaicRule = mr;
      console.debug("lockRasterIds: " +  mr.lockRasterIds)

      // Loads ImageService Layer
      var ndviLayer = new ArcGISImageServiceLayer(ndviLayerURL, {
        ImageServiceParameters: params,
        opacity: 0.9
      });

      
      layers.push(ndviLayer);

      return layers;
    }

    return {
      loadServices: _loadServices
    };

  });

})();
