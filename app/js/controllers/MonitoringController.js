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
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    'dojo/domReady!'
], function(declare, Evented, lang, when, on, dom, domConstruct, domAttr, domClass, Topic,  xhr, Query,
            _WidgetBase, _TemplatedMixin, MenusController, template,
            ImageServiceIdentifyTask, MosaicRule, ImageServiceIdentifyParameters, MonitoringWidget,
            PictureMarkerSymbol, Graphic){

    return declare([Evented, _WidgetBase, _TemplatedMixin], {
        templateString: template,
        activeMosaic: null,
        activeRaster: null,
        handler: null,
        monitoringWidget: null,
        customSymbol: new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":8.15625,"type":"esriPMS","url":"http://static.arcgis.com/images/Symbols/AtoZ/blueP.png","imageData":"iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAABSJJREFUSEuFkwtMlXUYxr/KLGfTuF/lqmYHRehoCkiAeJlOHFq5yvLSWrWmlSKgAofL4SJeibzfzVurrTWbbZp5A5QD5+AFOHC4KqhNtFJbK8f06X2+8x04LJzv9tv/+7/v8zz/Px/fUZ5UMUU1kXFFlpyEYkv55OLqLuF+QlF1V9wac3lMgSV7gtESoUmfXvo884iYQvOP09ZZHr69vQELD7Th46Od+OToDXwk6wf72zB3qxVTZD7BWP0D9Zq1/9LnVE+NLTTdnLPNhgUHJeCbG3jvQCfe3deJdxzs78R86c+XftKWRkQZK2+OyTRN0SL6VkR2VXJMoeWvOTvbMU+Mc/d0IHl3B2bvvK6SpDFrh53ZuzowV+ZJ29swPs/8YHRW5Wwtyl66rIuj9Xmm+zNFkLTjGmYK07e1Y9qWdkzdal8dz4lftyFxM7HvZ1K3uRVjDZX3mKNFKkpYxoWfYtdbVWNCaTvivmpDvJgTxBwvzwmldvjMWawwqaQVMSXyLNATvbYeI1dWHFMDR66q0IcbTN1xpRS1ImpjC6I2tCB6Uwu+q7mH/qrrQTe2ld/FJNGMX9+CiaKnV5dR2R2SXq5XQleWl0QUXMEECaNAv64Z44TXRfit5U8tBnhrzzX1wIWHO/Gw+7HaM137W7RNiCxuhl68Y/IvIzitvEQJSS+rCM+vRcTaJowttqkreU04Yu4NTd7djvEb5MD1zThs/kPrAosOdSCswIbwNTaEGWsRlH6+QglMO39LV2CFrtCmElZkwxgRhBc34ZCTeZZ8FY4DjSdua11ggYSOKmgUbBiVb0VA6rlbSuCKc/dHGOUl5zfglYIGVaArbJTwRhys6g2dsaMVo6VHjjgdNnlLC0aId7gQmlsHf8lT/FPOdAXLJsRolYFVBFaMlJvzgP2m3zUr5PNpwajCBszb1y7v9JHa21p+B6HiC86zIii3HgE5tfBLOXNb8Us9WxWQfRlBefUIFkGIhA6XUOIc6lx1v/2DxUeuq1p66A2Q0GGGy/CVPMU35exe/8xqDMupk0EdAgX7AfXYa7qrxQDxm5vUngNqqKWHXuKXUQ1vyVN8Vpye7ptehmG5tT0ECIHCnso7WiQQW2pTe4Rz4uzxF3wkh3mKV9bV57yWnzb5ZtXAT94JhyrZtdh9sTc0psSm9lQ0DfUOfMTPHOapvyqPlNNTvNPOP/LNuQq/3F52Od00prSxz4xQT3wMV+CVeu4Rc9RAR3mmnEr3TCuDt+ESfHKu9MHXCUfPW/4pdi6BPvq1qL7lmfrrUs/UM/96Gyzwli/iqYiOeveUU0u0iH7rGdelx+Pdl51s9swwwUtu8SQ8VptAHfX02e19i02+4OeFF4e8WfSq+5c/V3isroSnoeZ/sM85ddRrPvp7wvnA5mDBTfATggf4hkW4LjnW4JFZBQ8GOZA9+5xTp+npo585ajBPYINDnqwXooU3BkUv+tRl2S/dbplmuGVZwJV79jnXdNTTRz9z1E9qgDBECBXGCXECP43pwoyhHx4oc11VIaFmcOWefW1OHfX00c8c5vW5qU6ggDegOHFQ1PtfuCw/+djNILeUlXv2tTl11NPX56aOd/qS4C5wGCLwT4oUJg797Pt619UXwJV7rc85ddTTR3/PO2XxgSewOUigwEXwEoKGLN61ySXtLLhyr/U5p456+ujvCXQuNp8VKOC7eUEYPDg5L/LllBPgyr3W55w66vsN668oVA8ZqEscOPTz4+DKvdOsn1KU/wDL8jMXyw1rAwAAAABJRU5ErkJggg==","contentType":"image/png","width":15.75,"height":21.75}),
        clickedGraph: new Graphic(null, null),

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

        _updateGraph: function(point){
            this.clickedGraph.setGeometry(point);
            this.clickedGraph.setSymbol(this.customSymbol);
            this.map.graphics.add(this.clickedGraph);
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
                this._updateGraph(evt.mapPoint);
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
            this.map.graphics.remove(this.clickedGraph);
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
            this.map.graphics.remove(this.clickedGraph);
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