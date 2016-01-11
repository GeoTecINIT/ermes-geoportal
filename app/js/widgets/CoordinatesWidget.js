define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/topic',
    "esri/map",
    "esri/geometry/webMercatorUtils",
    "dojo/dom",
    'dojo/on',
    'dojo/dom-attr',
    'dojo/dom-class',
    'esri/geometry/Point',
    'text!templates/coordinatesWidget.tpl.html',
    "dojo/domReady!"
], function(declare, lang, _WidgetBase, _TemplatedMixin, Topic, Map, webMercatorUtils,
            dom, on, domAttr, domClass, Point, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,

        constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){
            var middleX = (this.limits.xmin + (this.limits.xmax-this.limits.xmin)/2).toFixed(3);
            var middleY = (this.limits.ymin + (this.limits.ymax-this.limits.ymin)/2).toFixed(3);

            //domAttr.set(dom.byId('input-latitude'), "min", this.limits.ymin);
            //domAttr.set(dom.byId('input-latitude'), "max", this.limits.ymax);
            //domAttr.set(dom.byId('input-longitude'), "min", this.limits.xmin);
            //domAttr.set(dom.byId('input-longitude'), "max", this.limits.xmax);

            domAttr.set(dom.byId('input-latitude'), "value", middleY);
            domAttr.set(dom.byId('input-longitude'), "value", middleX);



            this.map.on("mouse-move", this._showCoordinates);
            this.map.on("mouse-drag", this._showCoordinates);
            this.own(on(dom.byId('goandchart-button'), 'click', lang.hitch(this, '_goAndChartClicked')));
            this.own(on(dom.byId('input-latitude'), 'change', lang.hitch(this, '_valueChanged')));
            this.own(on(dom.byId('input-longitude'), 'change', lang.hitch(this, '_valueChanged')));
            Topic.subscribe("coordinates/updatePointClicked", lang.hitch(this, '_updateCoordinates'));
        },

        _valueChanged: function(){
            var lat = document.getElementById('input-latitude').value;
            var lon = document.getElementById('input-longitude').value;
            var point = new Point(lon, lat);
            //this.map.centerAt(point);
            Topic.publish("coordinates/moveMarker", point);
        },
        _showCoordinates: function(evt) {
            var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
            dom.byId("currentLon").innerHTML = 'Lon: ' + mp.x.toFixed(3);
            dom.byId("currentLat").innerHTML = 'Lat: ' + mp.y.toFixed(3);
        },

        _goAndChartClicked: function(){
            //CREATE POINT
            var lat = document.getElementById('input-latitude').value;
            var lon = document.getElementById('input-longitude').value;
            var point = new Point(lon, lat);

            Topic.publish("coordinates/goAndChart", point);
        },

        _updateCoordinates: function(point){
            document.getElementById('input-latitude').value = point.getLatitude().toFixed(3);
            document.getElementById('input-longitude').value = point.getLongitude().toFixed(3);
        }

    });

});