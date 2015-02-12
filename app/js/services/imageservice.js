/*
  The imageservice.js file loads rasters within a mosaic datasets from an Image Service

  - It contains methods to pick up one raster file from the mosaic dataset

*/

/*global define */    // Jshint option to indicate global objects
(function() {
  'use strict';

  define([
    "esri/layers/ArcGISImageServiceLayer", 
    "esri/layers/ImageServiceParameters", 
    "esri/layers/MosaicRule", 
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/_base/array", 
    "dojo/_base/json", 
  ], function(ArcGISImageServiceLayer, ImageServiceParameters, MosaicRule, 
              Query, QueryTask, lang, declare, array, json) {


      return declare(
        "ImageService", // The class name
        null,           // No ancestors
        {               // Attributes
          _config: {},
          _activeRasterId : 1,   // Default value should be last image
          _serviceUrl: "",
          _activeLayer: null,  

          // The constructor function that gets called via "new ImageService"
          constructor: function (serviceUrl, config) {
            this._serviceUrl = serviceUrl;
            declare.safeMixin(this._config, config);
            this._rasters = []; // Array should be declared in the constructor so that each instance gets its own copy
            this._rasters = this._getRasterNames();
            this._activeRasterId = this._getCount();
            this._loadService();
          },

          _loadService: function() {
            // Define image service parameters
            var params = new ImageServiceParameters();
            params.noData = 0;

            // Loads ImageService Layer
            this._layer = new ArcGISImageServiceLayer(this.getServiceUrl(), {
              ImageServiceParameters: params
              //opacity: 0.9    // TODO: config object via the constructor. Put also map via constructur?
            });

            //this._layer._map = this._config.map;
            this.setMosaicRule();
          },

          getActiveRasterId: function() { 
            return this._activeRasterId;
          },

          getServiceUrl: function() {
            return this._serviceUrl;
          },

          getActiveLayer: function() {
            return this._layer;
          },

          setMosaicRule: function() {
            var mr = new MosaicRule();
            mr.ascending = true;
            mr.method = MosaicRule.METHOD_LOCKRASTER;
            mr.lockRasterIds = [this.getActiveRasterId()];  

            this._layer.setMosaicRule(mr);
          },

          _getCount: function() {
            var qTask = new QueryTask(this.getServiceUrl());
            //build query filter
            var query = new Query();
  
            qTask.executeForCount(query, 
              lang.hitch(this, function(count) {
                this._activeRasterId = count;
              }), 
              function(error) {
                console.log(error);
              });
          },

          _getRasterNames: function() {
            var qTask = new QueryTask(this.getServiceUrl());
            //build query filter
            var query = new Query();
            query.returnGeometry = false;
            query.outFields = ["OBJECTID", "NAME"];

            qTask.execute(query, 
              lang.hitch(this, function(featureSet) {
                var numRasters = featureSet.features.length;
                var rasters = [];
                
                for (var i=0; i<numRasters; i++) {
                  rasters.push(featureSet.features[i].attributes);
                }
                this._rasters = rasters;  // It doesn't work - look at Rene's book
              }), 
              function(error) {
                console.log(error);
              });
          }, 

          // get pixel value

          // rendering

          // make chart

          // get Statistics

          // make a selected lauer active  
          updateLayer: function (rasterId) {

          }

    }); // declare
  }); // define
})();