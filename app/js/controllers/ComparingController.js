define([
	'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/topic',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/topic',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'widgets/ComparingSwipeWidget',
    'text!templates/comparingMenu.tpl.html',
    'dojo/domReady!'	
	], function(declare, lang, when, Topic, on, dom, domConstruct, domAttr, 
		Topic, _WidgetBase, _TemplatedMixin, MenusController, SwipeWidget, template){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
			secondaryMosaic: null,
			secondaryRaster: null,
			swipeWidget: null,

		constructor: function(args){
			lang.mixin(this, args);
	    },

        resetSwipeWidget: function(){
            this._destroySwipeWidget();
            this._resetSecondatyLayer();
        },

        _destroySwipeWidget: function(){
            if(this.swipeWidget!=null){
                this.swipeWidget.destroySwipe();
                this.swipeWidget.destroy();
            }
        },

        _resetSecondatyLayer: function(){
            var l = this.map.getLayer(this.secondaryMosaic + " " + this.secondaryRaster);
            if(l!=null){
                this.map.removeLayer(l);
                this.secondaryMosaic==null;
            }
        },

	    _createSwipeWidget: function(){
            this._destroySwipeWidget();
            

            var layer = this.mosaics[this.secondaryMosaic].getLayerByID(this.secondaryRaster);
            layer.id = this.secondaryMosaic + " " + this.secondaryRaster;
            this.map.addLayer(layer);


	    	this.swipeWidget = new SwipeWidget({
                map: this.map,
                secondaryLayer: layer
            }, "comparing-widget-container")
	    },

	    _createCompareButton: function(mosaicId, rasterId, rasterDate){
            // First I remove the actual "secondaryLayer", to clean the map.
            this._resetSecondatyLayer();
            var rasterButton = dom.byId("comparing-raster-selector-button");
            rasterButton.innerHTML = rasterDate;
            this.secondaryMosaic = mosaicId;
            this.secondaryRaster = rasterId;
            
            domConstruct.destroy('compare-button');
            
            var button = domConstruct.create('button');
            domAttr.set(button, 'id', 'compare-button');
            domAttr.set(button, 'id', 'compare-button');
            button.innerHTML = "Compare";
            var clickHandler = lang.hitch(this, "_createSwipeWidget");
            this.own(on(button, "click", clickHandler));


            var container = dom.byId('comparing-button-container');
            domConstruct.place(button, container, "only");

        },

        _populateRasterList: function(rastersList, mosaicId, mosaicName){

	    	domConstruct.destroy('compare-button');
            var container = dom.byId("comparing-rasters-list-ul");
            var mosaicButton = dom.byId("comparing-mosaic-selector-button");
            mosaicButton.innerHTML = mosaicName;
            var rasterButton = dom.byId("comparing-raster-selector-button");
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
                var clickHandler = lang.hitch(this, "_createCompareButton", mosaicId, raster, rasterDate);
                this.own(on(a, "click", clickHandler));
                domConstruct.place(a, li, "only");
                domConstruct.place(li, container, "last");
            }            
        },

        populateMosaicsList: function(){
        	var container = dom.byId('comparing-mosaics-list-ul');

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
        }
	});

});