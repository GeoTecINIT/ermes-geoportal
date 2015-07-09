define([
    'dojo/_base/declare',
    'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/topic',
    'dojo/request/xhr',
    'esri/tasks/query',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'text!templates/monitoringMenu.tpl.html',
    'esri/tasks/ImageServiceIdentifyTask',
    'esri/layers/MosaicRule',
    'esri/tasks/ImageServiceIdentifyParameters',
    'widgets/MonitoringWidget',
    'dojo/domReady!'
], function(declare, Evented, lang, when, on, dom, domConstruct, domAttr, domClass, Topic,  xhr, Query,
            _WidgetBase, _TemplatedMixin, MenusController, template,
            ImageServiceIdentifyTask, MosaicRule, ImageServiceIdentifyParameters, MonitoringWidget){

    return declare([Evented, _WidgetBase, _TemplatedMixin], {
        templateString: template,
        activeMosaic: null,
        activeRaster: null,
        handler: null,
        monitoringWidget: null,

        constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){
            if(this.userProfile=="regional") {
                this.own(on(dom.byId('clean-raster-map'), 'click', lang.hitch(this, '_noneRaster')));
                this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showClickedPoint'));
                Topic.subscribe("mosaic/raster-click", lang.hitch(this, '_rasterValuesCompleted'));
                this.handler.pause();
            } else if (this.userProfile=="local"){
                this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showParcelInfo'));
            }
        },

        _showParcelInfo: function(evt){
            //Consultar PARCEL ID clicado
            var query = new Query();
            query.geometry = evt.mapPoint;
            this.map.infoWindow.show(evt.mapPoint, this.map.getInfoWindowAnchor(evt.screenPoint));
            this.parcelsLayer.queryFeatures(query, lang.hitch(this, "_queryMongoServer"));
            //Cuando acabe, consultar servicio con parcel ID y username (this.username)


        },

        _queryMongoServer: function(response){
            var serviceURL = "http://localhost:6585/api/parcelsinfo/";
            //var serviceURL = "http://ermes.dlsi.uji.es:6585/parcelsinfo/";
            var username = this.username;
            var password = getCookie("password");
            var parcelid = response.features[0].attributes.PARCEL_ID;


            xhr(serviceURL, {
                handleAs: "json",
                method: "POST",
                data: {
                    username:  this.username,
                    password: getCookie("password"),
                    parcelid: response.features[0].attributes.PARCEL_ID
                },
                headers: {
                    "X-Requested-With": null
                }
            }).then(lang.hitch(this, "_showInfoWindow"));

        },

        _showInfoWindow: function(data, evt){
            console.log(data);
            if(data.parcels)
                this.map.infoWindow.setContent("PARCEL ID: " + data.parcels[0].parcelId);
            else
                this.map.infoWindow.setContent("This parcel doesn't belong to you.");

        },

        _showClickedPoint: function(evt){
            if( this.mosaics[this.activeMosaic]) {
                this.mosaics[this.activeMosaic].getRasterValues(evt.mapPoint);
                this.handler.pause();
                this.destroyChart();
                var div = domConstruct.create("div");
                domAttr.set(div, "id", "loading-image");
                var span = domConstruct.create("span");
                domAttr.set(span, "class", "glyphicon glyphicon-refresh glyphicon-refresh-animate");
                var h1 = domConstruct.create("h1");
                domConstruct.place(span, h1, "only");
                domConstruct.place(h1, div, "only");
                var container = dom.byId("monitoring-div");
                domConstruct.place(div, container, "last");
            }
        },

        _rasterValuesCompleted: function(){
            domConstruct.destroy("loading-image");
            var constructDiv = function(){
                var div = domConstruct.create("div");
                domAttr.set(div, "id", "monitoring-widget-container");
                var container = dom.byId("monitoring-div");
                domConstruct.place(div, container, "last");
            }

            this.destroyChart();
            constructDiv();
            var allValues = arguments[0];
            var actualValue = allValues[this.activeRaster-1];
            this.monitoringWidget = new MonitoringWidget({
                actualValue: actualValue,
                rasterValues: allValues,
                mosaicName: this.activeMosaic,
                actualTimePosition: this.activeRaster,
                mosaic: this.mosaics[this.activeMosaic]
            }, 'monitoring-widget-container');

            this.handler.resume();

        },

        getActiveMosaicAndRaster: function(){
            return [this.activeMosaic, this.activeRaster];
        },

        _showRaster: function(mosaicId, rasterId, rasterDate){
            this.destroyChart();
            var rasterButton = dom.byId("monitoring-raster-selector-button");

            var labelRasterName = dom.byId("main-raster-name");
            labelRasterName.innerHTML="ERMES Product: " + mosaicId + "<br>Date: " + rasterDate;

            domClass.replace(labelRasterName, "visible", "notvisible");


            rasterButton.innerHTML = rasterDate;
            this.activeMosaic = mosaicId;
            this.activeRaster = rasterId;

            this.emit("raster-selected",{});
            this.handler.resume();
        },

        _noneRaster: function(){

            this.emit("raster-selected-none",{});
            var labelRasterName = dom.byId("main-raster-name");
            domClass.replace(labelRasterName, "notvisible", "visible");
            this.stopClickHandler();
            this.destroyChart();
            this.activeRaster = null;
        },

        _populateRasterList: function(rastersList, mosaicId, mosaicName){

            this.destroyChart();

            this.handler.pause();

            var container = dom.byId("monitoring-rasters-list-ul");
            var mosaicButton = dom.byId("monitoring-mosaic-selector-button");
            mosaicButton.innerHTML = mosaicName;
            var rasterButton = dom.byId("monitoring-raster-selector-button");
            rasterButton.innerHTML = "Select Raster";

            container.innerHTML ="";

            var isFirst=true;

            for(var raster in rastersList){
                var rasterId = rastersList[raster][0];
                var rasterDate = rastersList[raster][1];
                var li = domConstruct.create("li");
                domAttr.set(li, "rasterId", rasterId);
                var a = domConstruct.create("a");
                a.innerHTML = rasterDate;
                domAttr.set(a,"href","#");
                var clickHandler = lang.hitch(this, "_showRaster", mosaicId, raster, rasterDate);
                this.own(on(a, "click", clickHandler));
                domConstruct.place(a, li, "only");
                domConstruct.place(li, container, "last");
                if(isFirst){
                    var mId = mosaicId;
                    var r = raster;
                    var rD = rasterDate;
                    isFirst=false;
                }
            }
            this._showRaster(mId, r, rD);


        },

        populateMosaicsList: function(){
            var container = dom.byId('monitoring-mosaics-list-ul');

            for(var mosaic in this.mosaics){
                var mosaicId = this.mosaics[mosaic].mosaicId;
                var mosaicName = this.mosaics[mosaic].name;
                var li = domConstruct.create("li");
                domAttr.set(li, "mosaicId", mosaicId);
                var a = domConstruct.create("a");
                a.innerHTML = mosaicName;
                domAttr.set(a,"href","#");
                var clickHandler = lang.hitch(this, "_populateRasterList", this.mosaics[mosaic].rasters, mosaicId, mosaicName);
                this.own(on(a, "click", clickHandler));
                domConstruct.place(a,li,"only");
                domConstruct.place(li, container, "last");
            }
        },

        stopClickHandler: function(){
            this.handler.pause();
        },

        destroyChart: function(){
            if(this.monitoringWidget!=null){
                this.monitoringWidget.destroy();
            }
        },

        startClickHandler: function(){
            this.handler.resume();
        }
    });
});

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