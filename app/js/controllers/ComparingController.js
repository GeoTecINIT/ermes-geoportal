define([
	'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/topic',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/topic',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'widgets/ComparingSwipeWidget',
    'text!templates/comparingMenu.tpl.html',
    'dojo/domReady!'	
	], function(declare, lang, when, Topic, on, dom, domConstruct, domAttr,  domClass,
		Topic, _WidgetBase, _TemplatedMixin, MenusController, SwipeWidget, template){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
			secondaryMosaic: null,
			secondaryRaster: null,
			swipeWidget: null,
            currentActiveYear: 2016,

		constructor: function(args){
			lang.mixin(this, args);


	    },

        postCreate: function(){
            this.own(on(dom.byId('comparing-radio-select-2015'), 'click', lang.hitch(this, '_yearChanged', 2015)));
            this.own(on(dom.byId('comparing-radio-select-2016'), 'click', lang.hitch(this, '_yearChanged', 2016)));
        },

        _yearChanged: function(year){
            //this._noneRaster();
            this.currentActiveYear = year;
            this.populateMosaicsList();
        },

        resetSwipeWidget: function(){
            this._destroySwipeWidget();
            this._resetSecondatyLayer();
        },

        _destroySwipeWidget: function(){
            var labelRasterName = dom.byId("compared-raster-name");  
            domClass.replace(labelRasterName, "notvisible", "visible"); 

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

	    _createSwipeWidget: function(mosaicId, rasterDate){


            this._destroySwipeWidget();
            

            var layer = this.mosaics[this.secondaryMosaic].getLayerByID(this.secondaryRaster);
            layer.id = this.secondaryMosaic + " " + this.secondaryRaster;
            this.map.addLayer(layer);


            this.swipeWidget = new SwipeWidget({
                map: this.map,
                secondaryLayer: layer
            }, "comparing-widget-container")
            
            var labelRasterName = dom.byId("compared-raster-name");
            labelRasterName.innerHTML="ERMES Product: " + mosaicId + "<br>Date: " + rasterDate;
            domClass.replace(labelRasterName, "visible", "notvisible"); 
	    },

	    _createCompareButton: function(mosaicId, rasterId, rasterDate){
            this._resetSecondatyLayer();
            var rasterButton = dom.byId("comparing-raster-selector-button");
            rasterButton.innerHTML = rasterDate + '<span class="glyphicon glyphicon-chevron-down"></span>';
            this.secondaryMosaic = mosaicId;
            this.secondaryRaster = rasterId;
            
            domConstruct.destroy('compare-button');
            
            var button = domConstruct.create('button');
            domAttr.set(button, 'id', 'compare-button');
            domAttr.set(button, 'class', 'btn btn-default btn-block settings-button-tools');

            button.innerHTML = '<span class="glyphicon glyphicon-transfer"></span>Compare';

            this.own(on(button, "click", lang.hitch(this, "_createSwipeWidget", mosaicId, rasterDate)));


            var container = dom.byId('comparing-div-controls');
            domConstruct.place(button, container, "first");

        },

        _populateRasterList: function(rastersList, mosaicId, mosaicName){

	    	domConstruct.destroy('compare-button');
            var container = dom.byId("comparing-rasters-list-ul");
            var mosaicButton = dom.byId("comparing-mosaic-selector-button");
            mosaicButton.innerHTML = mosaicName + '<span class="glyphicon glyphicon-chevron-down"></span>';
            var rasterButton = dom.byId("comparing-raster-selector-button");
            rasterButton.innerHTML = 'Date <span class="glyphicon glyphicon-chevron-down"></span>';

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

            this._showDateSelector();
        },

        populateMosaicsList: function(){
        	var container = dom.byId('comparing-mosaics-list-ul');
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

        _showDateSelector: function() {
            var buttonGroup = dom.byId("comparing-rasters-selector-container");

            if(domClass.contains(buttonGroup, "comparing-dropdown-hidden")){
                domClass.remove(buttonGroup, "comparing-dropdown-hidden");
                domClass.add(buttonGroup, "comparing-dropdown-visible");
            }
        },

        _hideDateSelector: function() {
            var buttonGroup = dom.byId("comparing-rasters-selector-container");

            if(domClass.contains(buttonGroup, "comparing-dropdown-visible")){
                domClass.remove(buttonGroup, "comparing-dropdown-visible");
                domClass.add(buttonGroup, "comparing-dropdown-hidden");
            }
        },






	});

});