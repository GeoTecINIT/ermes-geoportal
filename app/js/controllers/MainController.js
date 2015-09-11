define([
    'dojo/_base/declare',
    'dojo/Evented',
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/on',
    'dojo/dom',
    "dojo/dom-construct",
    'dojo/dom-attr',
    "esri/request",
    "esri/map",
    "esri/dijit/Scalebar",
    "esri/dijit/InfoWindow",
    "esri/dijit/Legend",
    "models/Mosaic",
    "dojo/topic",
    'esri/layers/FeatureLayer',
    "esri/layers/ArcGISDynamicMapServiceLayer",
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'controllers/MenusController',
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/graphic",
    'dojo/request/xhr',
    "esri/tasks/query",
    'dojo/domReady!'
], function (declare, Evented, lang, arrayUtils, on, dom, domConstruct, domAttr, esriRequest, Map,
             Scalebar, InfoWindow, Legend, Mosaic, Topic, FeatureLayer, ArcGISDynamicMapServiceLayer,
             _WidgetBase, _TemplatedMixin, MenusController,
             SimpleRenderer, SimpleLineSymbol, SimpleFillSymbol, Color, Graphic,
            xhr, Query) {

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
        legendDigit: null,
        legendListener: null,


        constructor: function(){
            var requestJSONSuccess = lang.hitch(this, '_requestSuccess')
            esriRequest(this._requestConfigFile()).then(requestJSONSuccess);
            var handleCancelLegend = Topic.subscribe('cancel-legend', lang.hitch(this,"_cancelLegend"));
            var handleEnableLegend = Topic.subscribe('enable-legend', lang.hitch(this,"_enableLegend"));
        },

        _cancelLegend: function(data){
            if(this.legendListener!=null){
                //this.legendDijit.destroy();
                this.legendListener.remove();
            }
        },

        _enableLegend: function(data){
            if(this.legendListener!=null){
                this.legendListener.remove();
                this._startListener();
            }
        },

        _cleanMap: function(){
            if(this.primaryRasterLayer!=null){
                this.map.removeLayer(this.primaryRasterLayer);
            }
        },

        _changeRaster: function(){

            var newMosaic =  this.menusController.getActiveMosaicAndRaster()[0];
            var newRaster =  this.menusController.getActiveMosaicAndRaster()[1];
            this.activeMosaic = newMosaic;
            var newLayer = this.mosaics[newMosaic].getLayerByID(newRaster);
            if(this.primaryRasterLayer!=null){
                this.map.removeLayer(this.primaryRasterLayer);
            }
            newLayer.setOpacity(0.7);
            this.primaryRasterLayer = newLayer;

            this.map.addLayer(newLayer);

            //ADD LEGEND DIV
            if(this.legendDijit!=null){
                this.legendDijit.destroy();
            }
            var constructLegendDiv = function(){
                var legendDiv = domConstruct.create("div");
                domAttr.set(legendDiv, "id", "legend-tool");
                var container = dom.byId("legend-div");
                domConstruct.place(legendDiv, container, "first");
            };
            constructLegendDiv();
        },

        _mosaicLoaded: function(){
            mosaicsLoaded++;
            if(mosaicsLoaded==this.mosaics.length)
                this.menusController.loadMosaics();
        },

        _drawLegend: function(evt){
            var legendTitle = "LEGEND: " + this.activeMosaic;
            this.legendDijit = new Legend({
                map: this.map,
                layerInfos: [{layer: evt.layer, title: legendTitle }]
            }, "legend-tool");
            this.legendDijit.startup();
        },

        _requestSuccess: function(response) {

            //INITIATES MAP
            this.map = new Map("map-index-div", response.mapOptions);

            //INFO WINDOW FOR LOCAL USERS
            var infowindow = null;
            if(this.userProfile=="local") {
                infoWindow = new InfoWindow({
                    domNode: domConstruct.create("div", null, dom.byId("map-index-div"))
                });
                infoWindow.startup();
                this.map.on("load", function() {
                    var options = lang.mixin({
                        map: this.map,
                        infoWindow: infoWindow}, response);
                });
            } else if (this.userProfile=="regional"){
                this.map.on("load", function() {
                    var options = lang.mixin({
                        map: this.map
                    }, response);
                });
            }

            //SCALE BAR
            var scalebar = new Scalebar({
                map: this.map,
                scalebarUnit: "dual",
                attachTo: "bottom-left"
            });

            //INITIATE PARCELS LAYER FOR LOCAL USER
            if(this.userProfile=="local") {
                this.parcelsLayer = new FeatureLayer(response.parcelsLayer.url,
                    {
                        outFields: ["*"]
                    });
                this.map.addLayer(this.parcelsLayer);
                this.parcelsLayer.on('update-end', lang.hitch(this, "_getOwnedParcels"));
                //this.map.on('update-end', this._getOwnedParcels());

            }

            //START THE LISTENER FOR THE LEGEND
            this.map.on('load', lang.hitch(this, "_startListener"));

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

        _startListener: function(){
            this.legendListener = this.map.on("layer-add", lang.hitch(this, "_drawLegend"));
        },

        _getOwnedParcels: function(){
            function contains(array, value) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === value) {
                        return true;
                    }
                }
                return false;
            }
            var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0]), 5),
                new Color([255, 255, 0, 0])
            );
            var parcelsURL = "http://ermes.dlsi.uji.es:6585/api/users/short/" + this.username;
            xhr(parcelsURL, {
                handleAs: "json",
                method: "GET",
                headers: {
                    "X-Requested-With": null
                }
            }).then(lang.hitch(this, function (data) {
                    var myParcels = data.parcels.split(',');
                    var layer =  this.parcelsLayer;
                    function findOwnedParcels(element, index, array) {
                        if(contains(myParcels, element.attributes.PARCEL_ID)){
                            var geometry = element.geometry;
                            layer.add(new Graphic(geometry, symbol, element.attributes));
                        }
                    }
                    this.parcelsLayer.graphics.forEach(findOwnedParcels);
                })
            );
        },
        //

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
            else if(this.userRegion=="greece" && this.userProfile=="local") {
                configFileURL = "./config/config-greece-local.json";
            }
            else if(this.userRegion=="greece" && this.userProfile=="regional") {
                configFileURL = "./config/config-greece-full.json";
            }

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
