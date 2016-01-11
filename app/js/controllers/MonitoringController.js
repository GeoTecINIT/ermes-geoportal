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
    'text!templates/parcelInfo.tpl.html',
    'text!templates/productHelp.tpl.html',
    'esri/tasks/ImageServiceIdentifyTask',
    'esri/layers/MosaicRule',
    'esri/tasks/ImageServiceIdentifyParameters',
    'widgets/MonitoringWidget',
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    "esri/tasks/ProjectParameters",
    "esri/tasks/GeometryService",
    'dojo/domReady!'
], function(declare, Evented, lang, when, on, dom, domConstruct, domAttr, domClass, Topic,  xhr, Query,
            _WidgetBase, _TemplatedMixin, MenusController, template, parcelTemplate, productHelpTemplate,
            ImageServiceIdentifyTask, MosaicRule, ImageServiceIdentifyParameters, MonitoringWidget,
            PictureMarkerSymbol, Graphic, ProjectParameters, GeometryService){

    return declare([Evented, _WidgetBase, _TemplatedMixin], {
        templateString: template,
        productHelpTemplate: productHelpTemplate,
        activeMosaic: null,
        activeRaster: null,
        handler: null,
        monitoringWidget: null,
        customSymbol: new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":8.15625,"type":"esriPMS","url":"http://static.arcgis.com/images/Symbols/AtoZ/blueP.png","imageData":"iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAABSJJREFUSEuFkwtMlXUYxr/KLGfTuF/lqmYHRehoCkiAeJlOHFq5yvLSWrWmlSKgAofL4SJeibzfzVurrTWbbZp5A5QD5+AFOHC4KqhNtFJbK8f06X2+8x04LJzv9tv/+7/v8zz/Px/fUZ5UMUU1kXFFlpyEYkv55OLqLuF+QlF1V9wac3lMgSV7gtESoUmfXvo884iYQvOP09ZZHr69vQELD7Th46Od+OToDXwk6wf72zB3qxVTZD7BWP0D9Zq1/9LnVE+NLTTdnLPNhgUHJeCbG3jvQCfe3deJdxzs78R86c+XftKWRkQZK2+OyTRN0SL6VkR2VXJMoeWvOTvbMU+Mc/d0IHl3B2bvvK6SpDFrh53ZuzowV+ZJ29swPs/8YHRW5Wwtyl66rIuj9Xmm+zNFkLTjGmYK07e1Y9qWdkzdal8dz4lftyFxM7HvZ1K3uRVjDZX3mKNFKkpYxoWfYtdbVWNCaTvivmpDvJgTxBwvzwmldvjMWawwqaQVMSXyLNATvbYeI1dWHFMDR66q0IcbTN1xpRS1ImpjC6I2tCB6Uwu+q7mH/qrrQTe2ld/FJNGMX9+CiaKnV5dR2R2SXq5XQleWl0QUXMEECaNAv64Z44TXRfit5U8tBnhrzzX1wIWHO/Gw+7HaM137W7RNiCxuhl68Y/IvIzitvEQJSS+rCM+vRcTaJowttqkreU04Yu4NTd7djvEb5MD1zThs/kPrAosOdSCswIbwNTaEGWsRlH6+QglMO39LV2CFrtCmElZkwxgRhBc34ZCTeZZ8FY4DjSdua11ggYSOKmgUbBiVb0VA6rlbSuCKc/dHGOUl5zfglYIGVaArbJTwRhys6g2dsaMVo6VHjjgdNnlLC0aId7gQmlsHf8lT/FPOdAXLJsRolYFVBFaMlJvzgP2m3zUr5PNpwajCBszb1y7v9JHa21p+B6HiC86zIii3HgE5tfBLOXNb8Us9WxWQfRlBefUIFkGIhA6XUOIc6lx1v/2DxUeuq1p66A2Q0GGGy/CVPMU35exe/8xqDMupk0EdAgX7AfXYa7qrxQDxm5vUngNqqKWHXuKXUQ1vyVN8Vpye7ptehmG5tT0ECIHCnso7WiQQW2pTe4Rz4uzxF3wkh3mKV9bV57yWnzb5ZtXAT94JhyrZtdh9sTc0psSm9lQ0DfUOfMTPHOapvyqPlNNTvNPOP/LNuQq/3F52Od00prSxz4xQT3wMV+CVeu4Rc9RAR3mmnEr3TCuDt+ESfHKu9MHXCUfPW/4pdi6BPvq1qL7lmfrrUs/UM/96Gyzwli/iqYiOeveUU0u0iH7rGdelx+Pdl51s9swwwUtu8SQ8VptAHfX02e19i02+4OeFF4e8WfSq+5c/V3isroSnoeZ/sM85ddRrPvp7wvnA5mDBTfATggf4hkW4LjnW4JFZBQ8GOZA9+5xTp+npo585ajBPYINDnqwXooU3BkUv+tRl2S/dbplmuGVZwJV79jnXdNTTRz9z1E9qgDBECBXGCXECP43pwoyhHx4oc11VIaFmcOWefW1OHfX00c8c5vW5qU6ggDegOHFQ1PtfuCw/+djNILeUlXv2tTl11NPX56aOd/qS4C5wGCLwT4oUJg797Pt619UXwJV7rc85ddTTR3/PO2XxgSewOUigwEXwEoKGLN61ySXtLLhyr/U5p456+ujvCXQuNp8VKOC7eUEYPDg5L/LllBPgyr3W55w66vsN668oVA8ZqEscOPTz4+DKvdOsn1KU/wDL8jMXyw1rAwAAAABJRU5ErkJggg==","contentType":"image/png","width":15.75,"height":21.75}),
        clickedGraph: new Graphic(null, null),
        mongoData: null,
        warmData: null,
        warmInfectionData: null,
        localDataReceived: 0,
        playIteration: 0,
        playMode: false,
        playInterval: 0,

        constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){
            this.own(on(dom.byId('clean-raster-map'), 'click', lang.hitch(this, '_noneRaster')));
            //Topic.subscribe("monitoring/close-chart", lang.hitch(this, function(){
            //    this.map.graphics.remove(this.clickedGraph);
            //}));
            if(this.userProfile=="regional") {
                this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showClickedPoint'));
                Topic.subscribe("mosaic/raster-click", lang.hitch(this, '_rasterValuesCompleted'));
                Topic.subscribe("coordinates/goAndChart", lang.hitch(this, '_showCoordinatesPoint'));
                Topic.subscribe("coordinates/moveMarker", lang.hitch(this, '_moveMarker'));
                this.handler.pause();
            } else if (this.userProfile=="local"){
                this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showParcelInfo'));

                this.map.infoWindow.on("hide", lang.hitch(this, function() {

                        this.map.infoWindow.setTitle("");
                        this.map.infoWindow.setContent("");
                    }
                ));
            }
            this.own(on(dom.byId('play-slider-button'), 'click', lang.hitch(this, '_playMode')));

        },

        _moveMarker: function(point){
            if(this.clickedGraph.geometry && this._isPointInLimits(point)) {
                this.map.centerAt(point);
                this.clickedGraph.setGeometry(point);
            }
        },

        _isPointInLimits: function(point){

            //return this.mosaics[this.activeMosaic].limits.contains(point);
            return true;
        },

        _showParcelInfo: function(evt){
            this._stopPlayMode();
            //Consultar PARCEL ID clicado
            var query = new Query();
            query.geometry = evt.mapPoint;
            this.map.infoWindow.show(evt.mapPoint, this.map.getInfoWindowAnchor(evt.screenPoint));
            this.map.infoWindow.setTitle("Searching...");
            var div = domConstruct.create("div");
            domAttr.set(div, "id", "loading-image");
            var span = domConstruct.create("span");
            domAttr.set(span, "class", "glyphicon glyphicon-refresh glyphicon-refresh-animate");
            var h1 = domConstruct.create("h1");
            domConstruct.place(span, h1, "only");
            domConstruct.place(h1, div, "only");
            this.map.infoWindow.setContent(div);
            this.parcelsLayer.queryFeatures(query, lang.hitch(this, "_queryMongoServer"));
        },

        _queryMongoServer: function(response){
            var serviceURL = "http://ermes.dlsi.uji.es:6686/api/parcelsinfo/";
            var username = this.username;
            var password = getCookie("password");
            if (response.features.length>0) {
                var parcelid = response.features[0].attributes.PARCEL_ID;


                xhr(serviceURL, {
                    handleAs: "json",
                    method: "POST",
                    data: {
                        username: username,
                        password: password,
                        parcelid: parcelid
                    },
                    headers: {
                        "X-Requested-With": null,
                        "X-Auth-Key": username+";"+password
                    }
                }).then(lang.hitch(this, "_receivedData", "local"));
            }
            else {
                this.map.infoWindow.setTitle("ERROR!");
                this.map.infoWindow.setContent("There is no parcel Here!");
            }

            var serviceURL = "http://ermes.dlsi.uji.es:6686/api/warm/development-stage";
            if (response.features.length>0) {
                var parcelid = response.features[0].attributes.PARCEL_ID;
                var now = new Date();
                var start = new Date(now.getFullYear(), 0, 0);
                var diff = now - start;
                var oneDay = 1000 * 60 * 60 * 24;

                var doy = Math.floor(diff / oneDay);

                xhr(serviceURL, {
                    handleAs: "json",
                    query: {
                        username: username,
                        parcelId: parcelid,
                        //Use this values to check if it is working.
                        //parcelId: "ES52346237A02500111G",
                        //parcelId: "ITC4801818601100083B",
                        //doy: 200,
                        doy: doy,
                        year: now.getFullYear()
                    },
                    headers: {
                        "X-Requested-With": null,
                        "X-Auth-Key": username+";"+password
                    }
                }).then(lang.hitch(this, "_receivedData", "warm"));
            }

            var serviceURL = "http://ermes.dlsi.uji.es:6686/api/warm/infection-risk";
            if (response.features.length>0) {
                var parcelid = response.features[0].attributes.PARCEL_ID;
                var now = new Date();
                var start = new Date(now.getFullYear(), 0, 0);
                var diff = now - start;
                var oneDay = 1000 * 60 * 60 * 24;

                var doy = Math.floor(diff / oneDay);

                xhr(serviceURL, {
                    handleAs: "json",
                    query: {
                        username: username,
                        parcelId: parcelid,
                        //Use this values to check if it is working.
                        //parcelId: "ES52346237A02500111G",
                        //parcelId: "ITC4801818601100083B",
                        //doy: 200,
                        doy: doy,
                        year: now.getFullYear()
                    },
                    headers: {
                        "X-Requested-With": null,
                        "X-Auth-Key": username+";"+password
                    }
                }).then(lang.hitch(this, "_receivedData", "warmInfection"));
            }
        },

        _receivedData: function(profile, data, evt){
            if(profile=="local"){
                this.mongoData = data;
            }
            else if(profile=="warm"){
                this.warmData = data;
            }
            else if(profile=="warmInfection"){
                this.warmInfectionData = data;
            }
            this.localDataReceived++;
            if(this.localDataReceived==3){
                this.localDataReceived=0;
                this._showInfoWindow()
            }
        },

        _showInfoWindow: function(){
            //console.log(data);
            var data= this.mongoData;
            domConstruct.destroy("loading-image")
            if(data.parcels){
                var content = parcelTemplate;
                this.map.infoWindow.setContent(content);
                this.map.infoWindow.setTitle("Parcel ID: " + data.parcels[0].parcelId);
                if(data.parcels[0].agrochemicals.length>0){
                    var label = dom.byId("agrochemicals");
                    label.innerHTML = "Agrochemicals (" + data.parcels[0].agrochemicals.length + "):";
                    for(var i =0; i<data.parcels[0].agrochemicals.length; i++) {
                        var product = dom.byId("agrochemicals-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].agrochemicals[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Amount:</b> " + data.parcels[0].agrochemicals[i].amount;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Product:</b> " + data.parcels[0].agrochemicals[i].product;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].agrochemicals[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].cropInfos.length>0){
                    var label = dom.byId("cropInfos");
                    label.innerHTML = "Crop Info (" + data.parcels[0].cropInfos.length + "):";
                    for(var i =0; i<data.parcels[0].cropInfos.length; i++) {
                        var product = dom.byId("cropInfos-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].cropInfos[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Crop Type:</b> " + data.parcels[0].cropInfos[i].cropType;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Pudding:</b> " + data.parcels[0].cropInfos[i].pudding;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Rice Variety:</b> " + data.parcels[0].cropInfos[i].riceVariety;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Sowing Practice:</b> " + data.parcels[0].cropInfos[i].sowingPractice;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].cropInfos[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].diseases.length>0){
                    var label = dom.byId("diseases");
                    label.innerHTML = "Diseases (" + data.parcels[0].diseases.length + "):";
                    for(var i =0; i<data.parcels[0].diseases.length; i++) {
                        var product = dom.byId("diseases-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].diseases[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Comments:</b> " + data.parcels[0].diseases[i].comments;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Damage:</b> " + data.parcels[0].diseases[i].damage;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Name:</b> " + data.parcels[0].diseases[i].name;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].diseases[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].fertilizers.length>0){
                    var label = dom.byId("fertilizers");
                    label.innerHTML = "Fertilizers (" + data.parcels[0].fertilizers.length + "):";
                    for(var i =0; i<data.parcels[0].fertilizers.length; i++) {
                        var product = dom.byId("fertilizers-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].fertilizers[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Nitrogen Content:</b> " + data.parcels[0].fertilizers[i].nitrogenContent;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Phosphorus Content:</b> " + data.parcels[0].fertilizers[i].phosphorusContent;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Potassium Content:</b> " + data.parcels[0].fertilizers[i].potassiumContent;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Product:</b> " + data.parcels[0].fertilizers[i].product;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Quantity:</b> " + data.parcels[0].fertilizers[i].quantity;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].fertilizers[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].irrigationInfos.length>0){
                    var label = dom.byId("irrigationInfos");
                    label.innerHTML = "Irrigiation Info (" + data.parcels[0].irrigationInfos.length + "):";
                    for(var i =0; i<data.parcels[0].irrigationInfos.length; i++) {
                        var product = dom.byId("irrigationInfos-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Start Date:</b> " + new Date(data.parcels[0].irrigationInfos[i].startDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>End Date:</b> " + new Date(data.parcels[0].irrigationInfos[i].endDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Quantity of Water Measure:</b> " + data.parcels[0].irrigationInfos[i].quantityOfWaterMeasure;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Water Depth:</b> " + data.parcels[0].irrigationInfos[i].waterDepth;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Water Hours:</b> " + data.parcels[0].irrigationInfos[i].waterHours;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Water Quantity:</b> " + data.parcels[0].irrigationInfos[i].waterQuantity;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].irrigationInfos[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].observations.length>0){
                    var label = dom.byId("observations");
                    label.innerHTML = "Observations (" + data.parcels[0].observations.length + "):";
                    for(var i =0; i<data.parcels[0].observations.length; i++) {
                        var product = dom.byId("observations-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Comments:</b> " + data.parcels[0].observations[i].comments;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].observations[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].parcelStatus.length>0){
                    var label = dom.byId("parcelStatus");
                    label.innerHTML = "Parcel Status (" + data.parcels[0].parcelStatus.length + "):";
                    for(var i =0; i<data.parcels[0].irrigationInfos.length; i++) {
                        var product = dom.byId("parcelStatus-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].parcelStatus[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Status:</b> " + data.parcels[0].parcelStatus[i].parcelStatus;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].parcelStatus[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].phatogens.length>0){
                    var label = dom.byId("phatogens");
                    label.innerHTML = "Pathogens (" + data.parcels[0].phatogens.length + "):";
                    for(var i =0; i<data.parcels[0].phatogens.length; i++) {
                        var product = dom.byId("phatogens-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].phatogens[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Comments:</b> " + data.parcels[0].phatogens[i].comments;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Damage:</b> " + data.parcels[0].phatogens[i].damage;
                        domConstruct.place(li, ul, "last");
                        //var li = domConstruct.create("li");
                        //li.innerHTML = "<b>File:</b> " + data.parcels[0].phatogens[i].file;
                        //domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Name:</b> " + data.parcels[0].phatogens[i].name;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].phatogens[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].phenologies.length>0){
                    var label = dom.byId("phenologies");
                    label.innerHTML = "Phenologies (" + data.parcels[0].phenologies.length + "):";
                    for(var i =0; i<data.parcels[0].phenologies.length; i++) {
                        var product = dom.byId("phenologies-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].phenologies[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Code:</b> " + data.parcels[0].phenologies[i].code;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Development Stage:</b> " + data.parcels[0].phenologies[i].developmentStage;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Growth Stage:</b> " + data.parcels[0].phenologies[i].growthStage;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].phenologies[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].soils.length>0){
                    var label = dom.byId("soils");
                    label.innerHTML = "Soils (" + data.parcels[0].soils.length + "):";
                    for(var i =0; i<data.parcels[0].soils.length; i++) {
                        var product = dom.byId("soils-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].soils[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Organic Matter:</b> " + data.parcels[0].soils[i].organicMatter;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>PH:</b> " + data.parcels[0].soils[i].ph;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Soil Texture: </b>" + data.parcels[0].soils[i].soilTexture;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].soils[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].weeds.length>0){
                    var label = dom.byId("weeds");
                    label.innerHTML = "Weeds (" + data.parcels[0].weeds.length + "):";
                    for(var i =0; i<data.parcels[0].weeds.length; i++) {
                        var product = dom.byId("weeds-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].weeds[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Comments:</b> " + data.parcels[0].weeds[i].comments;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Damage:</b> " + data.parcels[0].weeds[i].damage;
                        domConstruct.place(li, ul, "last");
                        //var li = domConstruct.create("li");
                        //li.innerHTML = "<b>File:</b> " + data.parcels[0].weeds[i].file;
                        //domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Name: </b>" + data.parcels[0].weeds[i].name;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].weeds[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
                if(data.parcels[0].yields.length>0){
                    var label = dom.byId("yields");
                    label.innerHTML = "Yields (" + data.parcels[0].yields.length + "):";
                    for(var i =0; i<data.parcels[0].yields.length; i++) {
                        var product = dom.byId("yields-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Date:</b> " + new Date(data.parcels[0].yields[i].date).toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Comments:</b> " + data.parcels[0].yields[i].comments;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Yield:</b> " + data.parcels[0].yields[i].yield;
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Uploading Date: </b>" + new Date(data.parcels[0].yields[i].uploadingDate).toDateString();
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }

                 //UNCOMMENT FOR ENABLE CONNECTION WITH WARM DATABASE.
                if(!this.warmData.error){
                    var label = dom.byId("developmentStage");
                    label.innerHTML = "Development Stage (WARM) (" + this.warmData.res.products.length + "):";
                    for(var i =0; i<this.warmData.res.products.length; i++) {
                        var product = dom.byId("developmentStage-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        var day = this.warmData.res.products[i].doy;
                        var dateShowed = new Date();
                        dateShowed.setDate(dateShowed.getDate() + i);
                        li.innerHTML = "<b>Date:</b> " + dateShowed.toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>StageCode:</b> " + this.warmData.res.products[i].stagecode;
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }

                if(!this.warmInfectionData.error){
                    var label = dom.byId("infection");
                    label.innerHTML = "Infections (WARM) (" + this.warmInfectionData.res.products.length + "):";
                    for(var i =0; i<this.warmInfectionData.res.products.length; i++) {
                        var product = dom.byId("infection-data");
                        var ul = domConstruct.create("ul");
                        var li = domConstruct.create("li");
                        var day = this.warmInfectionData.res.products[i].doy;
                        var dateShowed = new Date();
                        dateShowed.setDate(dateShowed.getDate() + i);
                        li.innerHTML = "<b>Date:</b> " + dateShowed.toDateString();
                        domConstruct.place(li, ul, "last");
                        var li = domConstruct.create("li");
                        li.innerHTML = "<b>Infection Risk:</b> " + this.warmInfectionData.res.products[i].infectionRisk;
                        domConstruct.place(li, ul, "last");
                        domConstruct.place(ul, product, "last");
                    }
                }
            }
            else {
                this.map.infoWindow.setTitle("Invalid Parcel.");
                this.map.infoWindow.setContent("<b>This parcel doesn't belong to you.</b>");
            }
        },



        _updateGraph: function(point){
            this.clickedGraph.setGeometry(point);
            this.clickedGraph.setSymbol(this.customSymbol);
            this.map.graphics.add(this.clickedGraph);
        },

        _showLoadingImage: function(){
            var container = dom.byId("loading-icon-div");
            domClass.replace(container, "loading-icon-div-display", "loading-icon-div-hidden");
        },

        _hideLoadingImage: function(){
            var container = dom.byId("loading-icon-div");
            domClass.replace(container, "loading-icon-div-hidden", "loading-icon-div-display");
        },

        _showClickedPoint: function(evt){
            if(this._isPointInLimits(evt.mapPoint)) {
                this._stopPlayMode();
                Topic.publish("coordinates/updatePointClicked", evt.mapPoint);
                if (this.mosaics[this.activeMosaic] && this.mosaics[this.activeMosaic].plotType != 0) {
                    this.mosaics[this.activeMosaic].getRasterValues(evt.mapPoint);
                    this.handler.pause();
                    this.destroyChart();
                    this._showLoadingImage();
                    //var div = domConstruct.create("div");
                    //domAttr.set(div, "id", "loading-image");
                    //var span = domConstruct.create("span");
                    //domAttr.set(span, "class", "glyphicon glyphicon-refresh glyphicon-refresh-animate");
                    //var h1 = domConstruct.create("h1");
                    //domConstruct.place(span, h1, "only");
                    //domConstruct.place(h1, div, "only");
                    //var container = dom.byId("monitoring-div");
                    //domConstruct.place(div, container, "last");
                    this._updateGraph(evt.mapPoint);
                }
            }
        },

        _showCoordinatesPoint: function(point){
            if(this._isPointInLimits(point)) {
                this.map.centerAt(point);
                this._stopPlayMode();
                if (this.mosaics[this.activeMosaic] && this.mosaics[this.activeMosaic].plotType != 0) {
                    this._showLoadingImage();
                    this.mosaics[this.activeMosaic].getRasterValues(point);
                    this.handler.pause();
                    this.destroyChart();
                    //var div = domConstruct.create("div");
                    //domAttr.set(div, "id", "loading-image");
                    //var span = domConstruct.create("span");
                    //domAttr.set(span, "class", "glyphicon glyphicon-refresh glyphicon-refresh-animate");
                    //var h1 = domConstruct.create("h1");
                    //domConstruct.place(span, h1, "only");
                    //domConstruct.place(h1, div, "only");
                    //var container = dom.byId("monitoring-div");
                    //domConstruct.place(div, container, "last");
                    this._updateGraph(point);
                }
            }
        },

        _rasterValuesCompleted: function(){
            //domConstruct.destroy("loading-image");
            this._hideLoadingImage();
            var constructDiv = function(){
                var div = domConstruct.create("div");
                domAttr.set(div, "id", "monitoring-widget-container");
                var container = dom.byId("monitoring-widget-div");


                if(domClass.contains(container, "display-none")){
                    domClass.remove(container, "display-none");
                    domClass.add(container, "display-block");
                }

                domConstruct.place(div, container, "last");

            }

            this.destroyChart();

            var allValues = arguments[0];
            if(allValues[0].length!=0) {
                constructDiv();
                function getActualValue(date) {
                    for (var i = 0; allValues[0].length; i++) {
                        if (allValues[1][i] == date)
                            return allValues[0][i];
                    }

                }

                var actualValue = getActualValue(this.activeRaster);
                //var actualValue = allValues[this.activeRaster-1];
                this.monitoringWidget = new MonitoringWidget({
                    actualValue: actualValue,
                    rasterValues: allValues,
                    mosaicName: this.activeMosaic,
                    actualTimePosition: this.activeRaster,
                    mosaic: this.mosaics[this.activeMosaic]
                }, 'monitoring-widget-container');
            }



            this.handler.resume();
        },

        getActiveMosaicAndRaster: function(){
            return [this.activeMosaic, this.activeRaster];
        },

        closeSwipe: function(){

            $('#time-slider-container-div').removeClass('display-block').addClass('display-none');
            this._stopPlayMode();
        },

        _showRaster: function(mosaicId, rasterId, rasterDate){
            this.destroyChart();
            var rasterButton = dom.byId("monitoring-raster-selector-button");

            var labelRasterName = dom.byId("main-raster-name");
            labelRasterName.innerHTML="ERMES Product: " + mosaicId + "<br>Date: " + rasterDate;

            //Create and fill help button.
            var button = domConstruct.create("button");
            domAttr.set(button, "id", "product-help-button");
            domAttr.set(button, "class", "btn btn-default pull-right");
            domAttr.set(button, "data-toggle", "modal");
            domAttr.set(button, "data-target", "#product-help");
            button.innerHTML = "Product Help.";
            //<button id="general-help-button" class="btn btn-default pull-right" data-toggle="modal" data-target="#general-help">


            domConstruct.place(button, labelRasterName, "last");
            domConstruct.place(productHelpTemplate, labelRasterName, "last");
            var title = dom.byId("product-help-title");
            title.innerHTML = "Product Help: " + mosaicId;

            var content = dom.byId("product-help-content");
            content.innerHTML = this.mosaics[mosaicId].description;

            //Finish create and fill help button.
            domClass.replace(labelRasterName, "visible", "notvisible");


            rasterButton.innerHTML = rasterDate + '<span class="glyphicon glyphicon-chevron-down"></span>';
            $('#timeSliderDiv').addClass('event-disabled');
            $('#time-slider-date-div').html(rasterDate);

            //TODO USE THIS ONLY IF NECESSARY THIS CORRELATES THE GEOPORTAL WITH THEIR CATALOG
            var link = "http://get-it.ermes-fp7space.eu/layers/geonode:" + this.mosaics[mosaicId].rasters[rasterId][0].toLowerCase();
            $('#time-slider-catalog-link-div').html(link);


            var v = 0;
            for(var r in this.mosaics[mosaicId].rasters){
                if(r==rasterId)
                    break;
                v++;
            }
            $('#timeSliderDiv').slider('value',v);
            $('#timeSliderDiv').removeClass('event-disabled');
            this.activeMosaic = mosaicId;
            this.activeRaster = rasterId;

            this.emit("raster-selected",{});
            this.handler.resume();
        },

        _noneRaster: function(){

            this.emit("raster-selected-none",{});
            var labelRasterName = dom.byId("main-raster-name");
            domClass.replace(labelRasterName, "notvisible", "visible");
            if(this.userProfile=="regional") {
                this.stopClickHandler();
            }
            this.destroyChart();
            this.activeRaster = null;
            this.map.graphics.remove(this.clickedGraph);

            this._hideDateSelector();
            this._stopPlayMode();
        },

        _playMode: function(){
            if(this.playMode){
                this._stopPlayMode();


            }
            else{
                $('#play-pause-icon').removeClass('glyphicon-pause').addClass('glyphicon-pause');
                this.playMode = true;
                var frequency = 3000;
                var value = $('#timeSliderDiv').slider("option", "value");
                $('#timeSliderDiv').slider("value", value);

                var myFunction = lang.hitch(this, "_moveSlider");
                this.myInterval = setInterval(myFunction, frequency );
            }

        },

        _stopPlayMode: function(){
            this.playMode = false;
            clearInterval(this.myInterval);
            $('#play-pause-icon').removeClass('glyphicon-pause').addClass('glyphicon-play');
        },

        _moveSlider: function(value){
            $('#play-pause-icon').removeClass('glyphicon-play').addClass('glyphicon-pause');
            var value = $('#timeSliderDiv').slider("option", "value");
            value++;
            if(value==this.mosaics[this.activeMosaic].rasters.length) {
                this._stopPlayMode();
            }
            $('#timeSliderDiv').slider('value',value);
        },


        _showSlider: function(rastersList, mosaicId, mosaicName) {

            var rasterkeys = [];
            for(var el in rastersList){
                rasterkeys.push(el);
            }

            var that = this;

            var sliderChangeListener = function sliderChangeListener(evt, ui) {
                if($(this).hasClass('event-disabled')){
                    return;
                }
                console.log(rasterkeys[ui.value]);
                var _mosaicId = mosaicId;
                var _raster = rasterkeys[ui.value];
                var _rasterDate = rastersList[_raster][1];
                that._showRaster(_mosaicId, _raster, _rasterDate);
            };


            $('#time-slider-container-div').removeClass('display-none').addClass('display-block');
            $('#time-slider-date-div').html(rasterkeys[0]);
            //$('#time-slider-date-div').html(rasterId);
            $('#time-slider-title-div').html(mosaicId);

            if( $('#timeSliderDiv').slider("instance") )
                //$('#timeSliderDiv').slider("instance").destroy();
                $('#timeSliderDiv').slider("destroy");

            $('#timeSliderDiv').html = '';
            $('#timeSliderDiv').slider({
                min: 0,
                max: rasterkeys.length - 1,
                range: "min",
                value: 0
            })  .unbind('slidechange')
                .bind('slidechange', sliderChangeListener)
                .on('slide', function( event, ui ){
                    $('#time-slider-date-div').html(rasterkeys[ui.value]);
                });
        },

        _populateRasterList: function(rastersList, mosaicId, mosaicName){

            this.destroyChart();

            this.handler.pause();

            var container = dom.byId("monitoring-rasters-list-ul");

            this._showDateSelector();
            this._showSlider(rastersList, mosaicId, mosaicName);

            var mosaicButton = dom.byId("monitoring-mosaic-selector-button");
            mosaicButton.innerHTML = mosaicName + '<span class="glyphicon glyphicon-chevron-down"></span>';
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

        _showDateSelector: function() {
            var buttonGroup = dom.byId("monitoring-rasters-selector-container");

            if(domClass.contains(buttonGroup, "monitoring-dropdown-hidden")){
                domClass.remove(buttonGroup, "monitoring-dropdown-hidden");
                domClass.add(buttonGroup, "monitoring-dropdown-visible");
            }
        },

        _hideDateSelector: function() {
            var buttonGroup = dom.byId("monitoring-rasters-selector-container");

            if(domClass.contains(buttonGroup, "monitoring-dropdown-visible")){
                domClass.remove(buttonGroup, "monitoring-dropdown-visible");
                domClass.add(buttonGroup, "monitoring-dropdown-hidden");
            }
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
            this._stopPlayMode();

        },


        destroyChart: function(){
            if(this.monitoringWidget!=null){
                this.monitoringWidget.destroy();
            }
            this.map.infoWindow.hide();
            this.map.infoWindow.setTitle("");
            this.map.infoWindow.setContent("");
            var plotDiv = dom.byId("monitoring-widget-div");

            if(domClass.contains(plotDiv, "display-block")){
                domClass.remove(plotDiv, "display-block");
                domClass.add(plotDiv, "display-none");
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