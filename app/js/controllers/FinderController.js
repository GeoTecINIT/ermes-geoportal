define([
    "esri/map",
    "dojo/dom",
    "dojo/on",
    "dojo/dom-class",
    "dojo/request/xhr",
    "esri/geometry/Point",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/SpatialReference",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/graphic",
    //"dojo/domReady!"
    'dojo/_base/declare',
    'dojo/_base/lang',
    //'dojo/when',
    //'dojo/topic',
    //'dojo/on',
    //'dojo/dom',
    //'dojo/dom-construct',
    //'dojo/dom-attr',
    //'dojo/dom-class',
    //'dojo/topic',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    //'controllers/MenusController',
    //'widgets/ComparingSwipeWidget',
    'text!templates/finderMenu.tpl.html',
    'dojo/domReady!'
], function(Map, dom, on, domClass, xhr, Point, GeometryService, ProjectParameters, SpatialReference,
            SimpleMarkerSymbol, PictureMarkerSymbol, Graphic, declare, lang,
            _WidgetBase, _TemplatedMixin, template){

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        secondaryMosaic: null,
        secondaryRaster: null,
        swipeWidget: null,
        customSymbol: new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":8.15625,"type":"esriPMS","url":"http://static.arcgis.com/images/Symbols/AtoZ/blueP.png","imageData":"iVBORw0KGgoAAAANSUhEUgAAABUAAAAdCAYAAABFRCf7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAABSJJREFUSEuFkwtMlXUYxr/KLGfTuF/lqmYHRehoCkiAeJlOHFq5yvLSWrWmlSKgAofL4SJeibzfzVurrTWbbZp5A5QD5+AFOHC4KqhNtFJbK8f06X2+8x04LJzv9tv/+7/v8zz/Px/fUZ5UMUU1kXFFlpyEYkv55OLqLuF+QlF1V9wac3lMgSV7gtESoUmfXvo884iYQvOP09ZZHr69vQELD7Th46Od+OToDXwk6wf72zB3qxVTZD7BWP0D9Zq1/9LnVE+NLTTdnLPNhgUHJeCbG3jvQCfe3deJdxzs78R86c+XftKWRkQZK2+OyTRN0SL6VkR2VXJMoeWvOTvbMU+Mc/d0IHl3B2bvvK6SpDFrh53ZuzowV+ZJ29swPs/8YHRW5Wwtyl66rIuj9Xmm+zNFkLTjGmYK07e1Y9qWdkzdal8dz4lftyFxM7HvZ1K3uRVjDZX3mKNFKkpYxoWfYtdbVWNCaTvivmpDvJgTxBwvzwmldvjMWawwqaQVMSXyLNATvbYeI1dWHFMDR66q0IcbTN1xpRS1ImpjC6I2tCB6Uwu+q7mH/qrrQTe2ld/FJNGMX9+CiaKnV5dR2R2SXq5XQleWl0QUXMEECaNAv64Z44TXRfit5U8tBnhrzzX1wIWHO/Gw+7HaM137W7RNiCxuhl68Y/IvIzitvEQJSS+rCM+vRcTaJowttqkreU04Yu4NTd7djvEb5MD1zThs/kPrAosOdSCswIbwNTaEGWsRlH6+QglMO39LV2CFrtCmElZkwxgRhBc34ZCTeZZ8FY4DjSdua11ggYSOKmgUbBiVb0VA6rlbSuCKc/dHGOUl5zfglYIGVaArbJTwRhys6g2dsaMVo6VHjjgdNnlLC0aId7gQmlsHf8lT/FPOdAXLJsRolYFVBFaMlJvzgP2m3zUr5PNpwajCBszb1y7v9JHa21p+B6HiC86zIii3HgE5tfBLOXNb8Us9WxWQfRlBefUIFkGIhA6XUOIc6lx1v/2DxUeuq1p66A2Q0GGGy/CVPMU35exe/8xqDMupk0EdAgX7AfXYa7qrxQDxm5vUngNqqKWHXuKXUQ1vyVN8Vpye7ptehmG5tT0ECIHCnso7WiQQW2pTe4Rz4uzxF3wkh3mKV9bV57yWnzb5ZtXAT94JhyrZtdh9sTc0psSm9lQ0DfUOfMTPHOapvyqPlNNTvNPOP/LNuQq/3F52Od00prSxz4xQT3wMV+CVeu4Rc9RAR3mmnEr3TCuDt+ESfHKu9MHXCUfPW/4pdi6BPvq1qL7lmfrrUs/UM/96Gyzwli/iqYiOeveUU0u0iH7rGdelx+Pdl51s9swwwUtu8SQ8VptAHfX02e19i02+4OeFF4e8WfSq+5c/V3isroSnoeZ/sM85ddRrPvp7wvnA5mDBTfATggf4hkW4LjnW4JFZBQ8GOZA9+5xTp+npo585ajBPYINDnqwXooU3BkUv+tRl2S/dbplmuGVZwJV79jnXdNTTRz9z1E9qgDBECBXGCXECP43pwoyhHx4oc11VIaFmcOWefW1OHfX00c8c5vW5qU6ggDegOHFQ1PtfuCw/+djNILeUlXv2tTl11NPX56aOd/qS4C5wGCLwT4oUJg797Pt619UXwJV7rc85ddTTR3/PO2XxgSewOUigwEXwEoKGLN61ySXtLLhyr/U5p456+ujvCXQuNp8VKOC7eUEYPDg5L/LllBPgyr3W55w66vsN668oVA8ZqEscOPTz4+DKvdOsn1KU/wDL8jMXyw1rAwAAAABJRU5ErkJggg==","contentType":"image/png","width":15.75,"height":21.75}),
        marker: new Graphic(null, null),

        constructor: function(args){
            lang.mixin(this, args);

        },

        postCreate: function() {

            this.own(on(dom.byId("query-position-finder-button"), "click", lang.hitch(this, "getReference")));
            domClass.toggle(dom.byId("finder-div-container"), "finder-menu-hidden");

        },

        centerInCoordinates: function(data){
            var point = data[0];
            this.map.centerAt(point);

            this.marker.setGeometry(point);
            this.marker.setSymbol(this.customSymbol);
            this.map.graphics.add(this.marker);
        },

        centerMap: function(data) {
            dom.byId("answer-finder-label").innerHTML = "";

            var parser = new DOMParser();
            var xmlData = parser.parseFromString(data, "text/xml");
            var x = parseFloat(xmlData.getElementsByTagName("xcen")[0].textContent);
            var y = parseFloat(xmlData.getElementsByTagName("ycen")[0].textContent);
            var sr = xmlData.getElementsByTagName("srs")[0].textContent;
            sr = parseInt(sr.split(':')[1]);

            var spatialReference = new SpatialReference({wkid: sr});
            var point = new Point(x, y, spatialReference);

            var geometries = [];
            geometries.push(point);

            var centerInCoordinatesVar = lang.hitch(this, "centerInCoordinates");

            //var geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var geometryService = new GeometryService("http://ermes.dlsi.uji.es:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            var params = new ProjectParameters();
            params.geometries = geometries;
            params.outSR = this.map.spatialReference;
            geometryService.project(params).then(centerInCoordinatesVar);
        },

        askForCoordinates: function(data){
            var parser = new DOMParser();
            var xmlData= parser.parseFromString(data,"text/xml");

            if(xmlData.getElementsByTagName("pc1")[0]) {
                var parte1 = xmlData.getElementsByTagName("pc1")[0].textContent;
                var parte2 = xmlData.getElementsByTagName("pc2")[0].textContent;

                var referenciaCatastral = parte1 + parte2;
                var urlCoordenadas = this.urlServer + "/proxy?http://ovc.catastro.meh.es//ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_CPMRC?Provincia=&Municipio=&SRS=&RC=" + referenciaCatastral;
                var centerMapVar = lang.hitch(this, "centerMap");

                xhr.get(urlCoordenadas, {
                    headers: {
                        "X-Requested-With": null
                    }
                }).then(centerMapVar);
            }else{
                dom.byId("answer-finder-label").innerHTML = "Parcel does not exists.";
            }
        },

       getReference: function(){
            var province = "Valencia";
            var town = dom.byId("town-finder-input").value;
            var polygon = dom.byId("polygon-finder-input").value;
            var parcel = dom.byId("parcel-finder-input").value;
            if(!(province && town && polygon && parcel)){
                dom.byId("answer-finder-label").innerHTML = "Fill all fields.";
                return;
            }
            var urlReference = this.urlServer + "/proxy?http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejero.asmx/Consulta_DNPPP?" +
                "&Provincia=" + province + "&Municipio=" + town +
                "&Poligono=" + polygon + "&Parcela=" + parcel;

           var askForCoordinatesVar = lang.hitch(this, "askForCoordinates");

            xhr.get(urlReference, {
                headers: {
                    "X-Requested-With": null
                }
            }).then(askForCoordinatesVar);
        }


    });

});