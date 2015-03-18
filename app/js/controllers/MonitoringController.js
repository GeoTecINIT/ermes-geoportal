define([
	'dojo/_base/declare',
    'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/topic',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'text!templates/monitoringMenu.tpl.html',   
    'esri/tasks/ImageServiceIdentifyTask',
    'esri/layers/MosaicRule',
    'esri/tasks/ImageServiceIdentifyParameters',
    'widgets/MonitoringWidget',
    'dojo/domReady!'	
	], function(declare, Evented, lang, when, on, dom, domConstruct, domAttr, Topic,
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
            this.handler = on.pausable(this.map, 'click', lang.hitch(this, '_showClickedPoint'));
            Topic.subscribe("mosaic/raster-click", lang.hitch(this, '_rasterValuesCompleted'));
            this.handler.pause();
	    },

        _showClickedPoint: function(evt){
            this.mosaics[this.activeMosaic].getRasterValues(evt.mapPoint);
             this.handler.pause();
            if(this.monitoringWidget!=null){
                this.monitoringWidget.destroy();
            }        
            var div = domConstruct.create("div");
            domAttr.set(div, "id", "loading-image");
            var span = domConstruct.create("span");
            domAttr.set(span, "class", "glyphicon glyphicon-refresh glyphicon-refresh-animate");
            var h1 = domConstruct.create("h1");
            domConstruct.place(span, h1, "only");
            domConstruct.place(h1, div, "only");
            var container = dom.byId("monitoring-div");
            domConstruct.place(div, container, "last");
        },

        _rasterValuesCompleted: function(){
            domConstruct.destroy("loading-image");

            var constructDiv = function(){
                var div = domConstruct.create("div");
                domAttr.set(div, "id", "monitoring-widget-container");
                var container = dom.byId("monitoring-div");
                domConstruct.place(div, container, "last");
            }
            
            if(this.monitoringWidget!=null){
                this.monitoringWidget.destroy();
            }        
            constructDiv();
            var allValues = arguments[0];
            var actualValue = allValues[this.activeRaster-1];
            
            this.monitoringWidget = new MonitoringWidget({actualValue: actualValue, rasterValues: allValues}, 'monitoring-widget-container');
            this.handler.resume();
        },

        getActiveMosaicAndRaster: function(){
            return [this.activeMosaic, this.activeRaster];
        },

        _showRaster: function(mosaicId, rasterId, rasterDate){
            var rasterButton = dom.byId("monitoring-raster-selector-button");
            rasterButton.innerHTML = rasterDate;
            this.activeMosaic = mosaicId;
            this.activeRaster = rasterId;
             
            this.emit("raster-selected",{});
            this.handler.resume();
        },

        _populateRasterList: function(rastersList, mosaicId, mosaicName){
            this.handler.pause();

            var container = dom.byId("monitoring-rasters-list-ul");
            var mosaicButton = dom.byId("monitoring-mosaic-selector-button");
            mosaicButton.innerHTML = mosaicName;
            var rasterButton = dom.byId("monitoring-raster-selector-button");
            rasterButton.innerHTML = "Select Raster";

            container.innerHTML =""; 
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
            this.handler.pause();
        },

        startClickHandler: function(){
            this.handler.resume(); 
        }    
	});

});