define([
    'dojo/_base/declare',
    'dojo/Evented',
    "dojo/_base/lang", 
    'dojo/on',
    'dojo/dom',
    "esri/request",                 
    "esri/map",
    "models/Mosaic",
    'esri/layers/FeatureLayer',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'controllers/MenusController',  
    'dojo/domReady!'				       
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
        var requestJSONSuccess = lang.hitch(this, '_requestSuccess')
        esriRequest(this._requestConfigFile()).then(requestJSONSuccess);
      }, 

      _cleanMap: function(){
        for(var i = 1; i<this.map.layerIds.length; i++){
          var l = this.map.getLayer(this.map.layerIds[i]);
          this.map.removeLayer(l);
        }
      },

      _changeRaster: function(){
        this._cleanMap();
        var newMosaic =  this.menusController.getActiveMosaicAndRaster()[0];
        var newRaster =  this.menusController.getActiveMosaicAndRaster()[1];

        var newLayer = this.mosaics[newMosaic].getLayerByID(newRaster);
        newLayer.setOpacity(0.7);
        this.map.addLayer(newLayer);
      },

      _mosaicLoaded: function(){
        mosaicsLoaded++;
        if(mosaicsLoaded==this.mosaics.length)
          this.menusController.loadMosaics();
      },

      _requestSuccess: function(response) {

          //INITIATES MAP
          this.map = new Map("map-index-div", response.mapOptions);
          this.map.on("load", function() {
            var options = lang.mixin({
              map: this.map}, 
              response);
          });
          this.menusController = new MenusController({mosaics: this.mosaics, map: this.map, layers: this.layers}, 'basic-container-div');
          this.menusController.on("update-raster", lang.hitch(this,"_changeRaster"));
          this.menusController.startup();

          //INITIATES MOSAICS 
          for (var i=0; i < response.mosaics.length; i++) {
            var mosaicoPrueba = new Mosaic(response.mosaics[i]);
            mosaicoPrueba.on("mosaic-loaded", lang.hitch(this,"_mosaicLoaded"));
            mosaicoPrueba.startup();
            this.mosaics[mosaicoPrueba.mosaicId] = mosaicoPrueba;
            this.mosaics.length++;          
          }

          //INITIATES FEATURE LAYERS
          for (var i=0; i < response.layers.length; i++) {
            var lurl = response.layers[i].url;
            var lid = response.layers[i].id;
            var lname = response.layers[i].name;
            var ldescritpion = response.layers[i].description;
            var tempLayer = new FeatureLayer(lurl, {
              id: lid,
            });
            this.layers[lid] = tempLayer;
            this.layers.length++;
          }
          this.menusController.loadLayers();

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
