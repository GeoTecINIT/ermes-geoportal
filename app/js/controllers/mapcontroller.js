/*
  The mapcontroller.js file loads the map with the specified options and 
  uses a dojo/Deferred object to let us know when it is complete
*/

/*global define */    // Jshint option to indicate global objects
(function () {
  'use strict';

  define([
    'dojo/_base/declare',     // Builds JavaScript classes in Dojo
    'dojo/_base/lang',        // Provides suite of utility functions
    'dojo/on',                // Listens to events
    'dojo/Deferred',          // Generates JavaScripts promises
    'esri/map'                // Specifies ArcGIS API for JavaScript map module
  ], function (declare, lang, on, Deferred, Map) {

    // Declare creates a scoped, anonymous, with no inheritance class
    return declare(null, { // last parameter is an object containing methods and properties
      // Properties
      map: null,
      options: {},

      // Constructor method
      constructor: function(options) {
        declare.safeMixin(this.options, options); // combines two objects from left-to-right
      },

      // public methods
      load: function() {
        var deferred = new Deferred();
        var layersAdded = lang.hitch(this, function() {
            deferred.resolve(this.map);
          });

        this.map = new Map(this.options.elem, this.options.mapOptions);
        on.once(this.map, 'layers-add-result', layersAdded);
        this.map.addLayers(this.options.layers);
        return deferred.promise;
      }
    }); 

  });
})();
