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
    "esri/tasks/Query",
    "esri/tasks/QueryTask"
    "dojo/_base/array", 
    "dojo/_base/json", 
  ], function(ArcGISImageServiceLayer, ImageServiceParameters, MosaicRule, 
              Query, QueryTask, array, json) {


      return declare(
        "ImageService", // The class name
        null,           // No ancestors
        {               // Attributes
          _rasterId : 1,   // Default value should be last image
          _layerUrl: "",
          _layer: null,  

          // The constructor function that gets called via "new ImageService"
          constructor: (rasterId, layerUrl) {
            this._rasterId = rasterId;
            this._layerUrl = layerUrl;
          },


          _loadService: function() {
            // Define image service parameters
            var params = new ImageServiceParameters();
    
            // Loads ImageService Layer
            var ndviLayer = new ArcGISImageServiceLayer(ndviLayerURL, {
              ImageServiceParameters: params,
              opacity: 0.9
            });
          },

          _getRasterId: function() { 
            return this._rasterId;
          },

          _getRasterUrl: function() {
            return this._layerUrl;
          }


          setMosaicRule: function() {
            var activeLayers = [];
            var mr = new MosaicRule();
            mr.ascending = true;
            mr.method = MosaicRule.METHOD_LOCKRASTER;
            mr.lockRasterIds = activeLayers.push(this._getRasterId());  

            this._layer.setMosaicRule(mr);
          },

          getCount: function() {
            //build query filter
            var query = new Query();
            //query.outSpatialReference =  Spatail reference of the service
            query.returnGeometry = false;
            query.outFields = ["NAME"];
            query.returnCountOnly = true;
            // 
            _executeQueryTask(query, _getCountCallBack)  
          }

          _getCountCallBack: function (results) {

          }

          _executeQueryTask: function (query, callback) {
            //build query task
            var queryTask = new esri.tasks.QueryTask(this._getRasterUrl());
            queryTask.execute(query, callback);

          }, 

          
    
    function _loadServices(config) {
      var layers = [];

      

      
      layers.push(ndviLayer);

      return layers;
    }

    return {
      loadServices: _loadServices
    };

  });

})();
