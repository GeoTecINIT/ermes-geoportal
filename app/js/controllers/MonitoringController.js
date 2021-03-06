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
    'dojo/dom-form',
    'dojo/topic',
    'dojo/request/xhr',
    'esri/tasks/query',
    "esri/InfoTemplate",
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
], function(declare, Evented, lang, when, on, dom, domConstruct, domAttr, domClass, domForm, Topic,  xhr, Query,
            InfoTemplate, _WidgetBase, _TemplatedMixin, MenusController, template, parcelTemplate, productHelpTemplate,
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
        meteoData: null,
        warmInfectionData: null,
        localDataReceived: 0,
        playIteration: 0,
        playMode: false,
        playInterval: 0,
        currentPosition: [],
        productsList: [],
        clickEvent: null,
        currentShowChartFunction: null,
        statsLayerShowed: false,
        statsLayer: null,
        currentActiveYear: 2016,
        currentParcelIdEdited: null,
        alertsData: null,
        deleteProductHandler: null,
        editProductHandler: null,

        constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){
            this.own(on(dom.byId('clean-raster-map'), 'click', lang.hitch(this, '_noneRaster')));
            //Topic.subscribe("monitoring/close-chart", lang.hitch(this, function(){
            //    this.map.graphics.remove(this.clickedGraph);
            //}));

            //TODO Testing with LOCAL.

            Topic.subscribe("mosaic/raster-click", lang.hitch(this, '_rasterValuesCompleted'));
            Topic.subscribe("coordinates/goAndChart", lang.hitch(this, '_showCoordinatesPoint'));
            Topic.subscribe("coordinates/moveMarker", lang.hitch(this, '_moveMarker'));
            Topic.subscribe("stats/layerSelected", lang.hitch(this, '_statsLayerSelected'));
            Topic.subscribe("stats/layerUnselected", lang.hitch(this, '_statsLayerRemoved'));



            if(this.userProfile=="regional") {
                this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showClickedPoint'));
                //this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showClickedPoint'));
                //Topic.subscribe("mosaic/raster-click", lang.hitch(this, '_rasterValuesCompleted'));
                //Topic.subscribe("coordinates/goAndChart", lang.hitch(this, '_showCoordinatesPoint'));
                //Topic.subscribe("coordinates/moveMarker", lang.hitch(this, '_moveMarker'));
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

            this.own(on(dom.byId('radio-select-2015'), 'click', lang.hitch(this, '_yearChanged', 2015)));
            this.own(on(dom.byId('radio-select-2016'), 'click', lang.hitch(this, '_yearChanged', 2016)));


        },

        _yearChanged: function(year){
            this._noneRaster();
            this.currentActiveYear = year;
            this.populateMosaicsList();
        },

        _createViewInfoHandlers: function(){
            this.own(on(dom.byId('agrochemicals-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'agrochemical', 'previous')));
            this.own(on(dom.byId('agrochemicals-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'agrochemical', 'next')));
            this.own(on(dom.byId('agrochemicals-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'agrochemical')));

            this.own(on(dom.byId('cropInfo-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'cropInfo', 'previous')));
            this.own(on(dom.byId('cropInfo-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'cropInfo', 'next')));
            this.own(on(dom.byId('cropInfo-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'cropInfo')));

            this.own(on(dom.byId('disease-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'disease', 'previous')));
            this.own(on(dom.byId('disease-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'disease', 'next')));
            this.own(on(dom.byId('disease-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'disease')));

            this.own(on(dom.byId('fertilizer-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'fertilizer', 'previous')));
            this.own(on(dom.byId('fertilizer-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'fertilizer', 'next')));
            this.own(on(dom.byId('fertilizer-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'fertilizer')));

            this.own(on(dom.byId('irrigationInfos-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'irrigation', 'previous')));
            this.own(on(dom.byId('irrigationInfos-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'irrigation', 'next')));
            this.own(on(dom.byId('irrigationInfos-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'irrigation')));

            this.own(on(dom.byId('observation-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'observation', 'previous')));
            this.own(on(dom.byId('observation-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'observation', 'next')));
            this.own(on(dom.byId('observation-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'observation')));

            this.own(on(dom.byId('parcelStatus-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'soilCondition', 'previous')));
            this.own(on(dom.byId('parcelStatus-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'soilCondition', 'next')));
            this.own(on(dom.byId('parcelStatus-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'soilCondition')));

            this.own(on(dom.byId('pathogen-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'insect', 'previous')));
            this.own(on(dom.byId('pathogen-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'insect', 'next')));
            this.own(on(dom.byId('pathogen-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'insect')));

            this.own(on(dom.byId('phenology-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'cropPhenology', 'previous')));
            this.own(on(dom.byId('phenology-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'cropPhenology', 'next')));
            this.own(on(dom.byId('phenology-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'cropPhenology')));

            this.own(on(dom.byId('soil-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'soilType', 'previous')));
            this.own(on(dom.byId('soil-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'soilType', 'next')));
            this.own(on(dom.byId('soil-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'soilType')));

            this.own(on(dom.byId('weed-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'weed', 'previous')));
            this.own(on(dom.byId('weed-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'weed', 'next')));
            this.own(on(dom.byId('weed-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'weed')));

            this.own(on(dom.byId('yield-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'yield', 'previous')));
            this.own(on(dom.byId('yield-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'yield', 'next')));
            this.own(on(dom.byId('yield-edit-button'), 'click', lang.hitch(this, '_editObservationData', 'yield')));

            this.own(on(dom.byId('alert-previous-button'), 'click', lang.hitch(this, '_changeObservationData', 'alert', 'previous')));
            this.own(on(dom.byId('alert-next-button'), 'click', lang.hitch(this, '_changeObservationData', 'alert', 'next')));
            // this.own(on(dom.byId('alert-remove-button'), 'click', lang.hitch(this, '_removeActiveAlert')));
        },

        _editObservationData: function(product){
            var productData = this.productsList[product][this.currentPosition[product]];
            var header = dom.byId("edit-product-form-title");
            header.innerHTML = "Editing parcel: " + this.mongoData.parcel.parcelId  + ".";
            this._askForFormTemplate(product, productData);

            //body.innerHTML = "Product: " + product + " ID: " + productId;
        },



        _askForFormTemplate: function(product, productData){
            //var url = "http://localhost:6686/form-template/" + product;
            var url = this.urlServer + "/form-template/" + product;
            xhr(url, {}).then(lang.hitch(this, "_formTemplateReceived", product, productData));
        },

        _formTemplateReceived: function(product, productData, template){
            var compiled = _.template(template);
            var finalHTML = compiled(productData);

            var contentDiv = dom.byId("edit-product-form-content");
            domConstruct.place(finalHTML, contentDiv, "only");

            var formNode = dom.byId("form-template");
            //var url = "http://localhost:6686/api/products" + domAttr.get(formNode, "date-url") + "/" + productData._id;
            var url = this.urlServer + this.apiVersion + "/products" + domAttr.get(formNode, "date-url") + "/" + productData.productId;

            var sendButton = dom.byId("confirm-edit-product-button");
            this.editProductHandler = on(sendButton, 'click', lang.hitch(this, "_updateProduct", url, product, formNode, productData));

            var deleteButton = dom.byId("delete-product-button");
            this.deleteProductHandler = on(deleteButton, 'click', lang.hitch(this, "_deleteProduct", url));
        },

        _removeActiveAlert: function(){
           

        },

        _deleteProduct: function(url){
            var responseText = dom.byId("form-put-response-label");
            responseText.innerHTML = "Deleting Product...";

            // var bodyObject = '{ "' + product + '": ' + JSON.stringify(updatedData) + '}';
            var bodyObject = '{ "parcelId": "' + this.mongoData.parcel.parcelId + '"}';
            bodyObject = JSON.parse(bodyObject);
            bodyObject = JSON.stringify(bodyObject);

            xhr(url, {
                handleAs: "json",
                method: "DELETE",
                data: bodyObject,
                headers: {
                    "X-Requested-With": null,
                    "X-Authorization": "Bearer " + localStorage.token
                }
            }).then(lang.hitch(this, "_productUpdated"), lang.hitch(this, "_productUpdated"));
            this.deleteProductHandler.remove();
        },

        _updateProduct: function(url, product, formNode, productData){
            var responseText = dom.byId("form-put-response-label");
            responseText.innerHTML = "Updating Product..."


            var formDataJson = domForm.toJson(formNode);

            var updatedData = lang.mixin(lang.clone(productData), JSON.parse(formDataJson));
            _.each(updatedData, function(value, fieldName){


                if(fieldName.toLowerCase().match('date')){
                    if(fieldName!="uploadDate"){
                        var newDate = moment(value);
                        newDate = new Date(newDate);
                        updatedData[fieldName] = newDate;
                    }
                }
            });

            var bodyObject = '{ "' + product + '": ' + JSON.stringify(updatedData) + '}';
            bodyObject = JSON.parse(bodyObject);
            bodyObject = JSON.stringify(bodyObject);
            var username = this.username;
            var password = localStorage.password;
            //MAKE THE POST
            xhr(url, {
                handleAs: "json",
                method: "PUT",
                data: bodyObject,
                headers: {
                    "X-Requested-With": null,
                    "X-Authorization": "Bearer " + localStorage.token,
                    "Content-Type": "application/json"
                }
            }).then(lang.hitch(this, "_productUpdated"));
            this.editProductHandler.remove();
        },

        _productUpdated: function(response){
            var responseText = dom.byId("form-put-response-label");
            responseText.innerHTML = "Product Updated."
            lang.hitch(this, "_showParcelInfo", this.clickEvent)();
        },

        _changeObservationData: function(product, option){
            var oldValue = this.currentPosition[product];
            var previousNode = dom.byId(product + oldValue);
            if(previousNode){
                domClass.add(previousNode, "display-none");
                domClass.remove(previousNode, "display-block");
            }
            if(option=='next') var newValue = oldValue+1;
            else if(option=='previous') var newValue = oldValue-1;
            var node = dom.byId(product + newValue);
            if(node){
                domClass.remove(node, "display-none");
                domClass.add(node, "display-block");
            }
            else{
                domClass.add(previousNode, "display-block");
                domClass.remove(previousNode, "display-none");
                newValue = oldValue;
            }
            this.currentPosition[product] = newValue;
        },

        _moveMarker: function(point){
            if(this._isPointInLimits(point)){
                this.map.centerAt(point);
                if(this.clickedGraph.geometry) {
                    this.clickedGraph.setGeometry(point);
                }
            }
        },

        _isPointInLimits: function(point){

            //return this.mosaics[this.activeMosaic].limits.contains(point);
            return true;
        },

        _showParcelInfo: function(evt){
            if(!this.statsLayerShowed) {
                this.currentShowChartFunction = lang.hitch(this, "_showClickedPoint", evt);

                this._stopPlayMode();
                this.clickEvent = evt;
                //Consultar PARCEL ID clicado
                var query = new Query();
                query.geometry = evt.mapPoint;
                this.map.infoWindow.show(evt.mapPoint, this.map.getInfoWindowAnchor(evt.screenPoint));
                this.map.infoWindow.setTitle("<b id='info-window-searching-text'>Searching...</b>");
                var div = domConstruct.create("div");
                domAttr.set(div, "id", "loading-image");
                var span = domConstruct.create("span");
                domAttr.set(span, "class", "glyphicon glyphicon-refresh glyphicon-refresh-animate");
                var h1 = domConstruct.create("h1");
                domConstruct.place(span, h1, "only");
                domConstruct.place(h1, div, "only");
                this.map.infoWindow.setContent(div);
                this.parcelsLayer.queryFeatures(query, lang.hitch(this, "_queryMongoServer", evt));
                SetInfoWindowLanguage();
            }
        },

        _queryMongoServer: function(evt, response){
            //var serviceURL = "http://localhost:6686/api/parcelsinfo/";
            //var username = this.username;
            //var password = localStorage.password;
            if (response.features.length>0) {
                var parcelid = response.features[0].attributes.PARCEL_ID;
                //var serviceURL = this.urlServer + this.apiVersion + "/parcelsinfo/";
                var serviceURL = this.urlServer + this.apiVersion + "/parcels/" + parcelid;


                xhr(serviceURL, {
                    handleAs: "json",
                    method: "GET",
                    query: {
                        limit: "-1"
                    },
                    headers: {
                        "X-Requested-With": null,
                        "X-Authorization": "Bearer " + localStorage.token
                    }
                }).then(lang.hitch(this, "_receivedData", "local"), lang.hitch(this, "_receivedData", "local", {}));
            }
            else {
                this.map.infoWindow.setTitle("ERROR!");

                if(localStorage.language=="en") this.map.infoWindow.setContent("This parcel isn't yours or there is not parcel here.");
                if(localStorage.language=="gk") this.map.infoWindow.setContent("Το οικόπεδο αυτό δεν είναι δικό σας ή αν δεν υπάρχει οικόπεδο εδώ.");
                if(localStorage.language=="it") this.map.infoWindow.setContent("Questa terra non è tuo o non vi è nessun complotto qui.");
                if(localStorage.language=="es") this.map.infoWindow.setContent("Esta parcela no es suya o no hay parcela en este lugar.");
                lang.hitch(this, "_showClickedPoint", evt)();

            }

            //var serviceURL = this.urlServer + this.apiVersion + "/warm/developmentStages";
            //if (response.features.length>0) {
            //    var parcelid = response.features[0].attributes.PARCEL_ID;
            //    var now = new Date();
            //    var start = new Date(now.getFullYear(), 0, 0);
            //    var diff = now - start;
            //    var oneDay = 1000 * 60 * 60 * 24;
            //
            //    var doy = Math.floor(diff / oneDay);
            //
            //    xhr(serviceURL, {
            //        handleAs: "json",
            //        query: {
            //            //username: username,
            //            parcelId: parcelid,
            //            //Use this values to check if it is working.
            //            //parcelId: "ES52346237A02500111G",
            //            //parcelId: "ITC4801818601100083B",
            //            //doy: 200,
            //            doy: doy,
            //            year: now.getFullYear()
            //        },
            //        headers: {
            //            "X-Requested-With": null,
            //            "X-Authorization": "Bearer " + localStorage.token
            //        }
            //    }).then(lang.hitch(this, "_receivedData", "warm"), lang.hitch(this, "_receivedData", "warm", {}));
            //}
            //
            //var serviceURL = this.urlServer + this.apiVersion + "/warm/abioticRisks";
            //if (response.features.length>0) {
            //    var parcelid = response.features[0].attributes.PARCEL_ID;
            //    var now = new Date();
            //    var start = new Date(now.getFullYear(), 0, 0);
            //    var diff = now - start;
            //    var oneDay = 1000 * 60 * 60 * 24;
            //
            //    var doy = Math.floor(diff / oneDay);
            //
            //    xhr(serviceURL, {
            //        handleAs: "json",
            //        query: {
            //            //username: username,
            //            parcelId: parcelid,
            //            //Use this values to check if it is working.
            //            //parcelId: "ES52346237A02500111G",
            //            //parcelId: "ITC4801818601100083B",
            //            //doy: 200,
            //            doy: doy,
            //            year: now.getFullYear()
            //        },
            //        headers: {
            //            "X-Requested-With": null,
            //            "X-Authorization": "Bearer " + localStorage.token
            //        }
            //    }).then(lang.hitch(this, "_receivedData", "warmInfection"), lang.hitch(this, "_receivedData", "warmInfection", {}));
            //}

            var serviceURL = this.urlServer + this.apiVersion + "/warm";
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
                        //username: username,
                        parcelId: parcelid,
                        //Change for 2016.
                        year: now.getFullYear(),
                        // doy: 1
                        doy: doy
                        //year: 2015
                    },
                    headers: {
                        "X-Requested-With": null,
                        "X-Authorization": "Bearer " + localStorage.token
                    }
                }).then(lang.hitch(this, "_receivedData", "warm"), lang.hitch(this, "_receivedData", "warm", {}));
            }


            //METEO QUERY
            var serviceURL = this.urlServer + this.apiVersion + "/warm/meteo";
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
                        //username: username,
                        parcelId: parcelid,
                        //Change for 2016.
                        year: now.getFullYear()
                    },
                    headers: {
                        "X-Requested-With": null,
                        "X-Authorization": "Bearer " + localStorage.token
                    }
                }).then(lang.hitch(this, "_receivedData", "meteo"), lang.hitch(this, "_receivedData", "meteo", {}));
            }

            //ALERTS QUERY
            var serviceURL = this.urlServer + this.apiVersion + "/parcels/"  + response.features[0].attributes.PARCEL_ID + "/alerts";
            if (response.features.length>0) {
                var parcelid = response.features[0].attributes.PARCEL_ID;

                xhr(serviceURL, {
                    handleAs: "json",
                    headers: {
                        "X-Requested-With": null,
                        "X-Authorization": "Bearer " + localStorage.token
                    }
                }).then(lang.hitch(this, "_receivedData", "alert"), lang.hitch(this, "_receivedData", "alert", {}));
            }
        },

        _receivedData: function(profile, data, evt){
            if(profile=="local"){
                this.mongoData = data;
            }
            else if(profile=="warm"){
                this.warmData = data;
            }
            else if(profile=="meteo") {
                this.meteoData = data;
            }
            else if(profile=="alert"){
               this.alertsData = data;
            }
            this.localDataReceived++;
            if(this.localDataReceived==4){
                this.localDataReceived=0;

                //Fill mongo Data with alertsData
                if(this.alertsData.alerts.length>0)
                    this.mongoData.parcel.inDanger = true;
                else
                    this.mongoData.parcel.inDanger = false;


                this.map.infoWindow.resize(400, 400);

                this._showInfoWindow()
            } //IF ALERTS ADDED, CHANGE TO 4
        },

        _showInfoWindow: function(){
            var data= this.mongoData;
            domConstruct.destroy("loading-image")
            if(data.parcel){
                var content = parcelTemplate;
                this.map.infoWindow.setContent(content);

                if(this.activeRaster) {
                    $('#info-window-show-chart-button').removeClass('display-none').addClass('display-block');
                    $('#info-window-show-chart-text').removeClass('display-block').addClass('display-none');
                }
                else{
                    $('#info-window-show-chart-text').removeClass('display-none').addClass('display-block');
                    $('#info-window-show-chart-button').removeClass('display-block').addClass('display-none');
                }

                if(data.parcel.inDanger) {
                    $('#remove-alert-button-h4').removeClass('display-none').addClass('display-block');
                    $('#remove-alert-text-h4').removeClass('display-block').addClass('display-none');
                    $('#remove-alert-button').attr("data-parcelid", data.parcel.parcelId);
                }
                else{
                    $('#remove-alert-text-h4').removeClass('display-none').addClass('display-block');
                    $('#remove-alert-button-h4').removeClass('display-block').addClass('display-none');
                }

                var showInfoChartHandler = on(dom.byId("show-chart-from-info-window"), 'click', this.currentShowChartFunction);

                var removeAlertHandler = on(dom.byId("remove-alert-button"), 'click', lang.hitch(this, "_removeAlert"));


                this._createViewInfoHandlers();
                this.map.infoWindow.setTitle("<b id='info-window-parcel-id-title'>Parcel ID: </b>" + data.parcel.parcelId);

                if(data.agrochemicals.length>0){
                    $('#agrochemicals-nav').toggleClass("display-none display-block");
                    var quantity = data.agrochemicals.length;
                    var specificData = data.agrochemicals;
                    this._askForInfoTemplate('agrochemical', quantity, specificData);
                }
                if(data.cropInfos.length>0){
                    $('#cropInfos-nav').toggleClass("display-none display-block");
                    var quantity = data.cropInfos.length;
                    var specificData = data.cropInfos;
                    this._askForInfoTemplate('cropInfo', quantity, specificData);

                }
                if(data.diseases.length>0){
                    $('#diseases-nav').toggleClass("display-none display-block");
                    var quantity = data.diseases.length;
                    var specificData = data.diseases;
                    this._askForInfoTemplate('disease', quantity, specificData);
                }
                if(data.fertilizers.length>0){
                    $('#fertilizers-nav').toggleClass("display-none display-block");
                    var quantity = data.fertilizers.length;
                    var specificData = data.fertilizers;
                    this._askForInfoTemplate('fertilizer', quantity, specificData);
                }
                if(data.irrigations.length>0){
                    $('#irrigationInfos-nav').toggleClass("display-none display-block");
                    var quantity = data.irrigations.length;
                    var specificData = data.irrigations;
                    this._askForInfoTemplate('irrigation', quantity, specificData);
                }
                if(data.observations.length>0){
                    $('#observations-nav').toggleClass("display-none display-block");
                    var quantity = data.observations.length;
                    var specificData = data.observations;
                    this._askForInfoTemplate('observation', quantity, specificData);
                }
                if(data.soilConditions.length>0){
                    $('#parcelStatus-nav').toggleClass("display-none display-block");
                    var quantity = data.soilConditions.length;
                    var specificData = data.soilConditions;
                    this._askForInfoTemplate('soilCondition', quantity, specificData);
                }
                if(data.insects.length>0){
                    $('#phatogens-nav').toggleClass("display-none display-block");
                    var quantity = data.insects.length;
                    var specificData = data.insects;
                    this._askForInfoTemplate('insect', quantity, specificData);
                }
                if(data.cropPhenologies.length>0){
                    $('#phenologies-nav').toggleClass("display-none display-block");
                    var quantity = data.cropPhenologies.length;
                    var specificData = data.cropPhenologies;
                    this._askForInfoTemplate('cropPhenology', quantity, specificData);
                }
                if(data.soilTypes.length>0){
                    $('#soils-nav').toggleClass("display-none display-block");
                    var quantity = data.soilTypes.length;
                    var specificData = data.soilTypes;
                    this._askForInfoTemplate('soilType', quantity, specificData);
                }
                if(data.weeds.length>0){
                    $('#weeds-nav').toggleClass("display-none display-block");
                    var quantity = data.weeds.length;
                    var specificData = data.weeds;
                    this._askForInfoTemplate('weed', quantity, specificData);
                }
                if(data.yields.length>0){
                    $('#yields-nav').toggleClass("display-none display-block");
                    var quantity = data.yields.length;
                    var specificData = data.yields;
                    this._askForInfoTemplate('yield', quantity, specificData);
                }

                //ALERTS SHOWED
                if(this.alertsData.alerts.length>0){
                    $('#alert-nav').toggleClass("display-none display-block");
                    var quantity = this.alertsData.alerts.length;
                    var specificData = this.alertsData.alerts;
                    this._askForInfoTemplate('alert', quantity, specificData);
                }

                 //UNCOMMENT FOR ENABLE CONNECTION WITH WARM DATABASE.
                if(!this.warmData.error){
                    //Development Stage
                    if(this.warmData.developmentStages) {
                        var label = dom.byId("developmentStage-number");
                        label.innerHTML = "(" + this.warmData.developmentStages.length + "):";
                        var chartTitle = "Rice development stage";
                        var node = dom.byId("developmentStage-data");
                        ShowGraph(node, this.warmData.developmentStages, chartTitle);
                    }

                    //Infection
                    if(this.warmData.infectionRisks) {
                        var label = dom.byId("infection-number");
                        var chartTitle = "Potential Risk of Blast Infection";
                        label.innerHTML = "(" + this.warmData.infectionRisks.length + "):";
                        var node = dom.byId("infection-data");
                        ShowGraph(node, this.warmData.infectionRisks, chartTitle);
                    }

                    //Abiotic Risk
                    if(this.warmData.abioticRisks) {
                        var label = dom.byId("abioticRisk-number");
                        label.innerHTML = "(" + this.warmData.abioticRisks.length + "):";
                        var chartTitle = "Potential risk of Cold Sterility";
                        var node = dom.byId("abioticRisk-data");
                        ShowGraph(node, this.warmData.abioticRisks, chartTitle);
                    }

                    //Biomass
                    if(this.warmData.biomasses) {
                        var label = dom.byId("biomass-number");
                        label.innerHTML = "(" + this.warmData.biomasses.length + "):";
                        var chartTitle = "Above Ground Biomass";
                        var node = dom.byId("biomass-data");
                        ShowGraph(node, this.warmData.biomasses, chartTitle);
                    }

                    //PanicleBiomass
                    if(this.warmData.penicleBiomasses) {
                        var label = dom.byId("penicleBiomass-number");
                        label.innerHTML = "(" + this.warmData.penicleBiomasses.length + "):";
                        var chartTitle = "Panicle Biomasses";
                        var node = dom.byId("penicleBiomass-data");
                        ShowGraph(node, this.warmData.penicleBiomasses, chartTitle);
                    }

                }
                //if(!this.warmInfectionData.error){
                //    var label = dom.byId("infection");
                //    label.innerHTML = "Infections (WARM) (" + this.warmInfectionData.abioticRisks.length + "):";
                //    for(var i =0; i<this.warmInfectionData.abioticRisks.length; i++) {
                //        var product = dom.byId("infection-data");
                //        var ul = domConstruct.create("ul");
                //        var li = domConstruct.create("li");
                //        var day = this.warmInfectionData.abioticRisks[i].doy;
                //        var dateShowed = new Date();
                //        dateShowed.setDate(dateShowed.getDate() + i);
                //        li.innerHTML = "<b>Date:</b> " + dateShowed.toDateString();
                //        domConstruct.place(li, ul, "last");
                //        var li = domConstruct.create("li");
                //        li.innerHTML = "<b>Infection Risk:</b> " + this.warmInfectionData.abioticRisks[i].value;
                //        domConstruct.place(li, ul, "last");
                //        domConstruct.place(ul, product, "last");
                //    }
                //}
                if(!this.meteoData.error){
                    //Extract to formatedMeteoData
                    var formatedMeteoData = this._changeMeteoFormat(this.meteoData.meteo);
                    if(formatedMeteoData.radiation) {
                        var label = dom.byId("meteoRadiation-number");
                        label.innerHTML = "(" + formatedMeteoData.radiation.length + "):";
                        var chartTitle = "Radiation";
                        var node = dom.byId("meteoRadiation-data");

                        ShowGraph(node, formatedMeteoData.radiation, chartTitle);
                    }
                    if(formatedMeteoData.rainfall) {
                        var label = dom.byId("meteoRainfall-number");
                        label.innerHTML = "(" + formatedMeteoData.rainfall.length + "):";
                        var chartTitle = "Rainfall";
                        var node = dom.byId("meteoRainfall-data");

                        ShowGraph(node, formatedMeteoData.rainfall, chartTitle);
                    }
                    if(formatedMeteoData.maximumHumidity) {
                        var label = dom.byId("meteoMaximumHumidity-number");
                        label.innerHTML = "Humidity (" + formatedMeteoData.maximumHumidity.length + "):";
                        var chartTitle = "Maximum Humidity";
                        var node = dom.byId("meteoMaximumHumidity-data");

                        ShowGraph(node, formatedMeteoData.maximumHumidity, chartTitle);
                    }
                    if(formatedMeteoData.minimumHumidity) {
                        var label = dom.byId("meteoMinimumHumidity-number");
                        label.innerHTML = "(" + formatedMeteoData.minimumHumidity.length + "):";
                        var chartTitle = "Minimum Humidity";
                        var node = dom.byId("meteoMinimumHumidity-data");

                        ShowGraph(node, formatedMeteoData.minimumHumidity, chartTitle);
                    }
                    if(formatedMeteoData.maximumTemperature) {
                        var label = dom.byId("meteoMaximumTemperature-number");
                        label.innerHTML = "(" + formatedMeteoData.maximumTemperature.length + "):";
                        var chartTitle = "Maximum Temperature";
                        var node = dom.byId("meteoMaximumTemperature-data");

                        ShowGraph(node, formatedMeteoData.maximumTemperature, chartTitle);
                    }
                    if(formatedMeteoData.minimumTemperature) {
                        var label = dom.byId("meteoMinimumTemperature-number");
                        label.innerHTML = "(" + formatedMeteoData.minimumTemperature.length + "):";
                        var chartTitle = "Minimum Temperature";
                        var node = dom.byId("meteoMinimumTemperature-data");

                        ShowGraph(node, formatedMeteoData.minimumTemperature, chartTitle);
                    }
                    if(formatedMeteoData.windSpeed) {
                        var label = dom.byId("meteoWindSpeed-number");
                        label.innerHTML = "(" + formatedMeteoData.windSpeed.length + "):";
                        var chartTitle = "Wind Speed";
                        var node = dom.byId("meteoWindSpeed-data");

                        ShowGraph(node, formatedMeteoData.windSpeed, chartTitle);
                    }
                }
            }
            else {
                this.map.infoWindow.setTitle("<b id='info-window-invalid-parcel-title'>Invalid Parcel.</b>");
                this.map.infoWindow.setContent("<b id='parcel-not-owned-text'></b>");
                //this.map.infoWindow.setContent("<b>This parcel doesn't belong to you.</b>");
                this.currentShowChartFunction();

            }
            SetInfoWindowLanguage();
        },

        _changeMeteoFormat: function(originalMeteo){
            formatedMeteo = {};
            formatedMeteo.radiation = [];
            formatedMeteo.maximumHumidity = [];
            formatedMeteo.minimumHumidity = [];
            formatedMeteo.rainfall = [];
            formatedMeteo.maximumTemperature = [];
            formatedMeteo.minimumTemperature= [];
            formatedMeteo.windSpeed = [];

            for(var i = originalMeteo.length-1; i>0; i--){
                formatedMeteo.radiation.push({ "doy": originalMeteo[i].doy, "value": originalMeteo[i].radiation});
                formatedMeteo.maximumHumidity.push({ "doy": originalMeteo[i].doy, "value": originalMeteo[i].rhmax});
                formatedMeteo.minimumHumidity.push({ "doy": originalMeteo[i].doy, "value": originalMeteo[i].rhmin});
                formatedMeteo.rainfall.push({ "doy": originalMeteo[i].doy, "value": originalMeteo[i].rainfall});
                formatedMeteo.maximumTemperature.push({ "doy": originalMeteo[i].doy, "value": originalMeteo[i].tmax});
                formatedMeteo.minimumTemperature.push({ "doy": originalMeteo[i].doy, "value": originalMeteo[i].tmin});
                formatedMeteo.windSpeed.push({ "doy": originalMeteo[i].doy, "value": originalMeteo[i].windSpeed});
            }
            formatedMeteo.radiation = _.sortBy(formatedMeteo.radiation, "doy");
            formatedMeteo.maximumHumidity = _.sortBy(formatedMeteo.maximumHumidity, "doy");
            formatedMeteo.minimumHumidity = _.sortBy(formatedMeteo.minimumHumidity, "doy");
            formatedMeteo.rainfall = _.sortBy(formatedMeteo.rainfall, "doy");
            formatedMeteo.maximumTemperature = _.sortBy(formatedMeteo.maximumTemperature, "doy");
            formatedMeteo.minimumTemperature = _.sortBy(formatedMeteo.minimumTemperature, "doy");
            formatedMeteo.windSpeed = _.sortBy(formatedMeteo.windSpeed, "doy");

            return formatedMeteo;

        },

        _removeAlert: function(evt){
            var parcelId =  $('#remove-alert-button').attr("data-parcelid");
            //MAKE DELETE OF ALERTS

            var url = this.urlServer + this.apiVersion + "/parcels/" + parcelId + "/alerts";
            xhr(url, {
                handleAs: "json",
                method: "DELETE",
                headers: {
                    "X-Requested-With": null,
                    "X-Authorization": "Bearer " + localStorage.token
                }
            }).then(lang.hitch(this, "_alertRemoved"));

            $('#remove-alert-text-h4').removeClass('display-none').addClass('display-block');
            $('#remove-alert-button-h4').removeClass('display-block').addClass('display-none');
            lang.hitch(this, "_showParcelInfo", this.clickEvent)();
        },

        _alertRemoved: function(response){
            this.parcelsLayer.refresh();
        },

        _askForInfoTemplate: function(product, quantity, data){
            //var url = "http://localhost:6686/info-template/" + product;
            var url = this.urlServer + "/info-template/" + product;
            xhr(url, {
                //handleAs: "json",
            }).then(lang.hitch(this, "_showSpecificInfo", product, quantity, data));
        },

        _showSpecificInfo: function(product, quantity, data, template){
            var showInfoFunctions = [];

            showInfoFunctions['agrochemical'] = lang.hitch(this, "_showAgrochemicalsInfo");
            showInfoFunctions['cropInfo'] = lang.hitch(this, "_showCropInfoInfo");
            showInfoFunctions['disease'] = lang.hitch(this, "_showDiseasesInfo");
            showInfoFunctions['fertilizer'] = lang.hitch(this, "_showFertilizersInfo");
            showInfoFunctions['irrigation'] = lang.hitch(this, "_showIrrigationInfoInfo");
            showInfoFunctions['observation'] = lang.hitch(this, "_showObservationsInfo");
            showInfoFunctions['soilCondition'] = lang.hitch(this, "_showParcelStatusInfo");
            showInfoFunctions['insect'] = lang.hitch(this, "_showPathogensInfo");
            showInfoFunctions['cropPhenology'] = lang.hitch(this, "_showPhenologiesInfo");
            showInfoFunctions['soilType'] = lang.hitch(this, "_showSoilsInfo");
            showInfoFunctions['weed'] = lang.hitch(this, "_showWeedsInfo");
            showInfoFunctions['yield'] = lang.hitch(this, "_showYieldsInfo");
            showInfoFunctions['alert'] = lang.hitch(this, "_showAlertInfo");

            showInfoFunctions[product](template, quantity, data);

        },

        _showAgrochemicalsInfo: function(template, quantity, data){
            var label = dom.byId("agrochemicals-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['agrochemical'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['agrochemical'][i] = data[i];
                var product = dom.byId("agrochemicals-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("agrochemical"), "id", "agrochemical" + i);
            }
            this.currentPosition['agrochemical'] = quantity - 2;
            this._changeObservationData("agrochemical", 'next');
        },

        _showCropInfoInfo:  function(template, quantity, data){
            var label = dom.byId("cropInfos-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['cropInfo'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['cropInfo'][i] = data[i];
                var product = dom.byId("cropInfos-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("cropInfo"), "id", "cropInfo" + i);
            }
            this.currentPosition['cropInfo'] = quantity - 2;
            this._changeObservationData("cropInfo", 'next');
        },

        _showDiseasesInfo: function(template, quantity, data){
            var label = dom.byId("diseases-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['disease'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['disease'][i] = data[i];
                var product = dom.byId("diseases-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("disease"), "id", "disease" + i);
            }
            this.currentPosition['disease'] = quantity - 2;
            this._changeObservationData("disease", 'next');
        },

        _showFertilizersInfo: function(template, quantity, data){
            var label = dom.byId("fertilizers-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['fertilizer'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['fertilizer'][i] = data[i];
                var product = dom.byId("fertilizers-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("fertilizer"), "id", "fertilizer" + i);
            }
            this.currentPosition['fertilizer'] = quantity - 2;
            this._changeObservationData("fertilizer", 'next');
        },

        _showIrrigationInfoInfo: function(template, quantity, data){
            var label = dom.byId("irrigationInfos-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['irrigation'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['irrigation'][i] = data[i];
                var product = dom.byId("irrigationInfos-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("irrigation"), "id", "irrigation" + i);
            }
            this.currentPosition['irrigation'] = quantity - 2;
            this._changeObservationData("irrigation", 'next');
        },

        _showObservationsInfo: function(template, quantity, data){
            var label = dom.byId("observations-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['observation'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['observation'][i] = data[i];
                var product = dom.byId("observations-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("observation"), "id", "observation" + i);
            }
            this.currentPosition['observation'] = quantity - 2;
            this._changeObservationData("observation", 'next');
        },

        _showParcelStatusInfo: function(template, quantity, data){
            var label = dom.byId("parcelStatuses-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['soilCondition'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['soilCondition'][i] = data[i];
                var product = dom.byId("parcelStatuses-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("parcelStatus"), "id", "soilCondition" + i);
            }
            this.currentPosition['soilCondition'] = quantity - 2;
            this._changeObservationData("soilCondition", 'next');
        },

        _showPathogensInfo: function(template, quantity, data){
            var label = dom.byId("phatogens-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['insect'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['insect'][i] = data[i];
                var product = dom.byId("phatogens-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("pathogen"), "id", "insect" + i);
            }
            this.currentPosition['insect'] = quantity - 2;
            this._changeObservationData("insect", 'next');
        },

        _showPhenologiesInfo: function(template, quantity, data){
            var label = dom.byId("phenologies-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['cropPhenology'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['cropPhenology'][i] = data[i];
                var product = dom.byId("phenologies-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("phenology"), "id", "cropPhenology" + i);
            }
            this.currentPosition['cropPhenology'] = quantity - 2;
            this._changeObservationData("cropPhenology", 'next');
        },

        _showSoilsInfo: function(template, quantity, data){
            var label = dom.byId("soils-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['soilType'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['soilType'][i] = data[i];
                var product = dom.byId("soils-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("soil"), "id", "soilType" + i);
            }
            this.currentPosition['soilType'] = quantity - 2;
            this._changeObservationData("soilType", 'next');
        },

        _showWeedsInfo: function(template, quantity, data){
            var label = dom.byId("weeds-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['weed'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['weed'][i] = data[i];
                var product = dom.byId("weeds-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("weed"), "id", "weed" + i);

            }
            this.currentPosition['weed'] = quantity - 2;
            this._changeObservationData("weed", 'next');
        },

        _showYieldsInfo: function(template, quantity, data){
            var label = dom.byId("yields-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['yield'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['yield'][i] = data[i];
                var product = dom.byId("yields-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("yield"), "id", "yield" + i);

            }
            this.currentPosition['yield'] = quantity - 2;
            this._changeObservationData("yield", 'next');
        },

        _showAlertInfo: function(template, quantity, data){
            var label = dom.byId("alert-number");
            label.innerHTML = "(" + quantity + "):";
            this.productsList['alert'] = [];
            for(var i =0; i<quantity; i++) {
                var compiled = _.template(template);
                var finalHTML = compiled(data[i]);
                this.productsList['alert'][i] = data[i];
                var product = dom.byId("alert-data");
                domConstruct.place(finalHTML, product, "last");
                domAttr.set(dom.byId("alert"), "id", "alert" + i);

            }
            this.currentPosition['alert'] = quantity - 2;
            this._changeObservationData("alert", 'next');
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
                if(!this.statsLayerShowed) {
                    if (this.mosaics[this.activeMosaic] && this.mosaics[this.activeMosaic].plotType != 0) {
                        this.mosaics[this.activeMosaic].getRasterValues(evt.mapPoint);
                        this.handler.pause();
                        this.destroyChart();
                        this._showLoadingImage();

                        this._updateGraph(evt.mapPoint);
                    }
                }
                else{
                    lang.hitch(this, "_showStats", evt.mapPoint)();
                }

            }
        },

        _showStats: function(point){

            console.log("Show Stats!");
        },

        _statsLayerSelected: function(operationalLayer){
            this.statsLayerShowed = true;
            this.handler.resume();
            this.statsLayer = operationalLayer;
        },

        _statsLayerRemoved: function(operationalLayer){
            this.statsLayerShowed = false;
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
            var dataObject = arguments[1];

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
                    dataObject: dataObject,
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

            var link = "http://get-it.ermes-fp7space.eu/layers/geonode:" + this.mosaics[mosaicId].rasters[rasterId][0].toLowerCase();
            var proxyLink = this.urlServer + "/proxy?" + link;
            var catalogInfo = dom.byId('time-slider-catalog-link-div');
            xhr(proxyLink, { "method": "HEAD"}).then(function(response){
                    domAttr.set(catalogInfo, "href", link);
                    domClass.remove(catalogInfo, "simple-bold-text");
                    if(localStorage.language == "sp"){
                        catalogInfo.innerHTML="Ir al catálogo."
                    }
                    else{
                        catalogInfo.innerHTML="Go to Catalog."
                    }

                }, function(error){
                    domAttr.remove(catalogInfo, "href");
                    domClass.add(catalogInfo, "simple-bold-text");
                    catalogInfo.innerHTML=" "
                });


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
            //if(this.userProfile=="regional") {
                this.stopClickHandler();
            //}
            var mosaicButton = dom.byId("monitoring-mosaic-selector-button");
           // mosaicButton.innerHTML = 'Select ERMES Product: <span class="glyphicon glyphicon-chevron-down"></span>';
            SetDropdownLabels();
            var playWidget = dom.byId("time-slider-container-div");
            domClass.add(playWidget, "display-none");

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
                // console.log(rasterkeys[ui.value]);
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
            domConstruct.empty(container);
            for(var mosaic in this.mosaics){
                if(this.currentActiveYear == this.mosaics[mosaic].year) {
                    var mosaicId = this.mosaics[mosaic].mosaicId;
                    var mosaicName = this.mosaics[mosaic].name;
                    var li = domConstruct.create("li");
                    domAttr.set(li, "mosaicId", mosaicId);
                    var a = domConstruct.create("a");
                    a.innerHTML = mosaicName;
                    domAttr.set(a, "href", "#");
                    var clickHandler = lang.hitch(this, "_populateRasterList", this.mosaics[mosaic].rasters, mosaicId, mosaicName);
                    this.own(on(a, "click", clickHandler));
                    domConstruct.place(a, li, "only");
                    domConstruct.place(li, container, "last");
                }
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

//function getCookie(cname) {
//    var name = cname + "=";
//    var ca = document.cookie.split(';');
//    for(var i=0; i<ca.length; i++) {
//        var c = ca[i];
//        while (c.charAt(0)==' ') c = c.substring(1);
//        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
//    }
//    return "";
//}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}