define([
    'dojo/_base/declare',
    'dojo/Evented',
    "dojo/_base/lang",
    'dojo/on',
    'dojo/dom',
    "dojo/dom-construct",
    "esri/request",
    "esri/map",
    "esri/dijit/Scalebar",
    "esri/dijit/InfoWindow",
    "models/Mosaic",
    'esri/layers/FeatureLayer',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'dojo/domReady!'
], function (declare, Evented, lang, on, dom, domConstruct, esriRequest, Map,
             Scalebar, InfoWindow, Mosaic, FeatureLayer,
             _WidgetBase, _TemplatedMixin, MenusController) {

    var mosaicsLoaded = 0;

    return declare([Evented, _WidgetBase], {
        mosaics: [],
        layers:  [],
        map: null,
        menusController: null,
        activeMosaic: null,
        primaryRasterLayer: null,
        userProfile: null,
        userRegion: null,
        username: null,
        parcelsLayer: null,


        constructor: function(){
            var requestJSONSuccess = lang.hitch(this, '_requestSuccess')
            esriRequest(this._requestConfigFile()).then(requestJSONSuccess);
        },

        _cleanMap: function(){
            if(this.primaryRasterLayer!=null){
                this.map.removeLayer(this.primaryRasterLayer);
            }
        },

        _changeRaster: function(){
            var newMosaic =  this.menusController.getActiveMosaicAndRaster()[0];
            var newRaster =  this.menusController.getActiveMosaicAndRaster()[1];

            var newLayer = this.mosaics[newMosaic].getLayerByID(newRaster);
            if(this.primaryRasterLayer!=null){
                this.map.removeLayer(this.primaryRasterLayer);
            }
            newLayer.setOpacity(0.7);
            this.primaryRasterLayer = newLayer;

            this.map.addLayer(newLayer);
        },

        _mosaicLoaded: function(){
            mosaicsLoaded++;
            if(mosaicsLoaded==this.mosaics.length)
                this.menusController.loadMosaics();
        },

        _requestSuccess: function(response) {

            //INITIATES MAP
            var infowindow = null;
            if(this.userProfile=="local") {
                infoWindow = new InfoWindow({
                    domNode: domConstruct.create("div", null, dom.byId("map-index-div"))
                });
                infoWindow.startup();
            }
            this.map = new Map("map-index-div", response.mapOptions);
            this.map.on("load", function() {
                var options = lang.mixin({
                        map: this.map,
                        infoWindow: infoWindow}, response);


            });
            var scalebar = new Scalebar({
                map: this.map,
                scalebarUnit: "dual",
                attachTo: "bottom-left"
            });

            //INITIATE PARCELS LAYER
            this.parcelsLayer = new FeatureLayer(response.parcelsLayer.url,
                {
                    outFields: ["*"]
                });
            this.map.addLayer(this.parcelsLayer);

            //CREATE MENUS CONTROLLER
            this.menusController = new MenusController({
                mosaics: this.mosaics,
                map: this.map,
                layers: this.layers,
                userProfile: this.userProfile,
                userRegion: this.userRegion,
                username: this.username,
                parcelsLayer: this.parcelsLayer}, 'basic-container-div');
            this.menusController.on("update-raster", lang.hitch(this,"_changeRaster"));
            this.menusController.on("remove-raster", lang.hitch(this,"_cleanMap"));
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
            this.userRegion = getCookie("region");
            this.userProfile = getCookie("profile");
            this.username = getCookie("username");
            var configFileURL;
            if(this.userRegion=="italy" && this.userProfile=="local") {
                configFileURL = "./config/config-italy-local.json";
            }
            else if(this.userRegion=="italy" && this.userProfile=="regional") {
                configFileURL = "./config/config-italy-full.json";
            }
            else if(this.userRegion=="spain" && this.userProfile=="local") {
                configFileURL = "./config/config-spain-local.json";
            }
            else if(this.userRegion=="spain" && this.userProfile=="regional") {
                configFileURL = "./config/config-spain-full.json";
            }
            //else if(region=="greece" && profile=="local") {
            //    configFileURL = "./config/config-spain-local.json";
            //}
            //else if(region=="greece" && profile=="regional") {
            //    configFileURL = "./config/config-spain-full.json";
            //}


            return {
                url: configFileURL,
                handleAs: "json"
            };


            function getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
                }
                return "";
            }
        }

    });
});
