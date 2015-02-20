define([
    'dojo/_base/declare',
    'dojo/Evented',
    "dojo/_base/lang", 
    'dojo/on',
    'dojo/dom',
    "esri/request",                 // Loads resources from URL
    "esri/map",
    "models/Mosaic",
    'esri/layers/FeatureLayer',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'controllers/MenusController',  
    'dojo/domReady!'				        // Loads modules once page is loaded
  ], function (declare, Evented, lang, on, dom, esriRequest, Map, Mosaic, FeatureLayer,
           _WidgetBase, _TemplatedMixin, MenusController) {

    var mosaicsLoaded = 0;

    return declare([Evented, _WidgetBase], {
      mosaics: [],
      layers:  [],
      map: null,
      menusController: null,
      activeMosaic: null,

      constructor: function(){
        //Request the Options from the JSON file, when received, set the map.
        var requestJSONSuccess = lang.hitch(this, '_requestSuccess')
        esriRequest(this._requestConfigFile()).then(requestJSONSuccess);
        this.menusController = new MenusController({mosaics: this.mosaics}, 'basic-container-div');
        this.menusController.on("update-raster", lang.hitch(this,"_changeRaster"));
        this.menusController.startup();
      }, 

      postCreate: function() {
        //this.own(on(dom.byId('b1'), 'click', lang.hitch(this, '_PRUEBAS')));
      },

      _changeRaster: function(){
        var newMosaic =  this.menusController.getActiveMosaicAndRaster()[0];
        var newRaster =  this.menusController.getActiveMosaicAndRaster()[1];

        var newLayer = this.mosaics[newMosaic].getLayerByID(newRaster);
        newLayer.setOpacity(0.4);
        map.addLayer(newLayer);
      },

      _PRUEBAS: function(){
        
        //TESTING THE RASTERS INFORMATION
        for (var i = 0; i<this.mosaics.length; i++){
          console.debug("MOSAIC: " + this.mosaics[i].name);
          for (var k in this.mosaics[i].rasters){
           
              console.log("KEY: " + k + " NAME: " + this.mosaics[i].rasters[k][0] + " DATE: " + this.mosaics[i].rasters[k][1]);
            
          } 
        }

        //TESTING THE RASTERS LAYERS ON THE MAP
        var newLayer = this.mosaics[1].getLayerByID(1);
        newLayer.setOpacity(0.4);
        map.addLayer(newLayer);

        //TESTING THE FEATURE LAYERS ON THE MAP
        //map.addLayer(this.layers[0]);

      },

      _mosaicLoaded: function(){
        mosaicsLoaded++;
        if(mosaicsLoaded==this.mosaics.length)
          this.menusController.loadMosaics();
      },

      _requestSuccess: function(response) {

          //INITIATES MAP
          // Creates map object with default map options
          map = new Map("map-index-div", response.mapOptions);

          // When map loads, pass it to the options for widget loader
          map.on("load", function() {
            var options = lang.mixin({
              map: map}, 
              response);
          });

          //INITIATES MOSAICS 
          for (var i=0; i < response.mosaics.length; i++) {
            var mosaicoPrueba = new Mosaic(response.mosaics[i]);
            mosaicoPrueba.on("mosaic-loaded", lang.hitch(this,"_mosaicLoaded"));
            mosaicoPrueba.startup();
            this.mosaics.push(mosaicoPrueba);            
          }

          //INITIATES FEATURE LAYERS
          for (var i=0; i < response.layers.length; i++) {
            var lurl = response.layers[i].url;
            var lid = response.layers[i].id;
            var lname = response.layers[i].name;
            var ldescritpion = response.layers[i].description;
            var tempLayer = new FeatureLayer(lurl, {
              id: lid,
              name: lname,
              description: ldescritpion
            });
            this.layers.push(tempLayer); 
          }

      },

      _requestError: function(error) {
        console.log('ERROR - Loading config file: ' + error);
      },

      _requestConfigFile: function() {
        return {
          url: "config/config-rrs.json",
          handleAs: "json"
        };
      }
  });
});
