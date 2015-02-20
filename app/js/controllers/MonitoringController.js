define([
	'dojo/_base/declare',
    'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'text!templates/monitoringMenu.tpl.html',
    'dojo/domReady!'	
	], function(declare, Evented, lang, when, on, dom, domConstruct, domAttr,
		_WidgetBase, _TemplatedMixin, MenusController, template){
		
		return declare([Evented, _WidgetBase, _TemplatedMixin], {
			templateString: template,
            activeMosaic: null,
            activeRaster: null,

		constructor: function(args){
			console.log("Soy MonitoringController");
			lang.mixin(this, args);
	    },

	    postCreate: function(){

	    },

	    _PRUEBAS: function(){
        
        //TESTING THE RASTERS INFORMATION
	        for (var i = 0; i<this.mosaics.length; i++){
	          console.debug("MOSAIC: " + this.mosaics[i].name);
	          for (var k in this.mosaics[i].rasters){
	              console.log("KEY: " + k + " NAME: " + this.mosaics[i].rasters[k][0] + " DATE: " + this.mosaics[i].rasters[k][1]);
	          } 
	        }
    	},

        getActiveMosaicAndRaster: function(){
            return [this.activeMosaic, this.activeRaster];
        },

        _showRaster: function(mosaicId, rasterId, rasterDate){
            var rasterButton = dom.byId("raster-selector-button");
            rasterButton.innerHTML = rasterDate;
            this.activeMosaic = mosaicId;
            this.activeRaster = rasterId;
            
            this.emit("raster-selected",{});
        },

        _populateRasterList: function(rastersList, mosaicId, mosaicName){
            var container = dom.byId("rasters-list-ul");
            var mosaicButton = dom.byId("mosaic-selector-button");
            mosaicButton.innerHTML = mosaicName;
            var rasterButton = dom.byId("raster-selector-button");
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
                var clickHandler = lang.hitch(this, "_showRaster", mosaicId, rasterId, rasterDate);
                this.own(on(a, "click", clickHandler));
                domConstruct.place(a, li, "only");
                domConstruct.place(li, container, "last");
            }
            
        },

        populateMosaicsList: function(){
        	var container = dom.byId('mosaics-list-ul');

        	for(var i=0; i<this.mosaics.length; i++){
        		var mosaicId = this.mosaics[i].mosaicId;
        		var mosaicName = this.mosaics[i].name;
        		var li = domConstruct.create("li");
        		domAttr.set(li, "mosaicId", mosaicId);
        		//domAttr.set(li, "class", mosaicId);

        		var a = domConstruct.create("a");
        		a.innerHTML = mosaicName;
        		domAttr.set(a,"href","#");
                var clickHandler = lang.hitch(this, "_populateRasterList", this.mosaics[i].rasters, mosaicId, mosaicName);
                this.own(on(a, "click", clickHandler));
        		domConstruct.place(a,li,"only");
        		domConstruct.place(li, container, "last");
        	}
        }


        //TESTING THE RASTERS LAYERS ON THE MAP
        /*var newLayer = this.mosaics[1].getLayerByID(1);
        newLayer.setOpacity(0.4);
        map.addLayer(newLayer);

        //TESTING THE FEATURE LAYERS ON THE MAP
        //map.addLayer(this.layers[0]);*/

      
	});

});