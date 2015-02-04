/*
  The mapservices.js file creates loads operational layers form teh config file
  and createdinstances of FeatureLayer to use in the map as-needed
*/

/*global define */    // Jshint option to indicate global objects
(function() {
  'use strict';

  define([
    "dojo/_base/array", "dojo/_base/json", "esri/layers/FeatureLayer"
  ], function(array, json, FeatureLayer) {


    function _loadDefaultLayers(config) {
      var opLayers = config;
      var layers = [];
      var opLayerURL, opLayer;

      if (opLayers) {
        array.forEach(opLayers, function(layer) {
          opLayerURL = layer.url;
          // TODO: some properties  in config file are not traslated to layer object
          // TODO: Other types of layers other than FeatureLayer are not considered
          opLayer = new FeatureLayer(opLayerURL, json.toJson(layer));  
        });
        
        layers.push(opLayer);          
      }
      return layers;
    }



    function _loadServices(config) {
      var layers = [];

      var municipalitiesLayerURL = "http://ermes.dlsi.uji.es:6080/arcgis/rest/services/italy_vector_mxd/MapServer/1";
      var municipalitiesLayer = new FeatureLayer(municipalitiesLayerURL);
      
      layers.push(municipalitiesLayer);

      return layers;
    }

    return {
      loadDefaultLayers: _loadDefaultLayers
    };

  });

})();
