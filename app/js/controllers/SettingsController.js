define([
	'dojo/_base/declare',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-class',
	'dojo/dom-construct',
	'dojo/dom-attr',
	'esri/dijit/Print',
    'dojo/_base/lang',
    'dojo/when',
	'dojo/topic',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'text!templates/settingsMenu.tpl.html',
    'dojo/domReady!'	
	], function(declare, on, dom, domClass, domConstruct, domAttr, Print,
				lang, when, Topic, _WidgetBase, _TemplatedMixin, MenusController, template){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
			baseMaps: ['streets','satellite','hybrid','topo','gray',
						'oceans','national-geographic','osm'],

		constructor: function(args){
			lang.mixin(this, args);
	    },

	    postCreate: function(){
	    	//this.own(on(dom.byId('print-button'), 'click', lang.hitch(this, '_printMap')));
	    	this._populateBaseMaps();
			this._createPrinterService();


	    },

		_createPrinterService: function(){
			var printer = new Print({
				map: this.map,
				//url: "http://ermes.dlsi.uji.es:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
				url: "http://ermes.dlsi.uji.es:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
				//url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
				templates: [{
					label: "PDF",
					format: "PDF",
					layout: "A3 Landscape",
					layoutOptions: {
						titleText: "Printed Map",
						authorText: "ERMES Printer Service",
						copyrightText: "ERMES",
						scalebarUnit: "Kilometers",
					},
					exportOptions: {
						width: 2000,
						height: 2000,
						dpi: 96
					}
				}]
			}, dom.byId('print-button-div'));
			printer.startup();

		},

	    _capitalizeFirstLetter: function(string){
		    return string.charAt(0).toUpperCase() + string.slice(1);
	    },

	    _populateBaseMaps: function(){
	    	var container = dom.byId('basemap-list-ul');
	    	
	    	for(bm in this.baseMaps){
	    		var base = this.baseMaps[bm];
	    		var a = domConstruct.create('a');
	    		domAttr.set(a, "href", "#");
	    		domAttr.set(a, "id", base);

	    		var baseUpper = this._capitalizeFirstLetter(base);
	    		a.innerHTML = baseUpper;

	    		var clickHandler = lang.hitch(this, "_changeBaseMap", base);
	    		this.own(on(a, "click", clickHandler));
	    		var li = domConstruct.create('li');
	    		domConstruct.place(a,li,"only");
	    		domConstruct.place(li,container,"last");
	    	}
	    },

	    _changeBaseMap: function(baseMap){
	    	this.map.setBasemap(baseMap);
			dom.byId("basemap-selector-button").innerHTML=this._capitalizeFirstLetter(baseMap) + ' <span class="glyphicon glyphicon-chevron-down"></span>';
	    },

		_removeAllOperationalLayersFromMap: function(){
			for(var layerId in this.layers){
				var layer = this.map.getLayer(layerId);
				if(layer) this.map.removeLayer(layer);
			}
		},

		_allOperationalLayerButtonsOff: function(){
			for(var layerId in this.layers){
				domClass.remove(dom.byId(layerId + "-button"), 'btn-info');
				domClass.add(dom.byId(layerId + "-button"), 'btn-default');
			}
		},

		_showLayer: function(id){
			var layer = this.map.getLayer(id);

			if( layer == null) {
				lang.hitch(this, "_removeAllOperationalLayersFromMap")();
				layer = this.layers[id];
				Topic.publish("legend/updateLegend", id);
				this.map.addLayer(layer);
				Topic.publish("stats/layerSelected", layer);
				lang.hitch(this, "_allOperationalLayerButtonsOff")();
				domClass.add(dom.byId(id + "-button"), 'btn-info');
			}

			else{
				lang.hitch(this, "_removeAllOperationalLayersFromMap")();
				Topic.publish("legend/updateLegend", null);
				Topic.publish("stats/layerUnselected", layer);
				lang.hitch(this, "_allOperationalLayerButtonsOff")();
			}

			//_.contains(this.map.layerIds, )



			//if( layer == null){
			//	layer = this.layers[id];
			//	Topic.publish("legend/updateLegend", id);
			//	this.map.addLayer(layer);
			//	Topic.publish("stats/layerSelected", layer);
			//}
			//else{
			//	this.map.removeLayer(layer)
			//	Topic.publish("stats/layerUnselected", layer);
			//}
			//domClass.toggle(dom.byId(id + "-button"), 'btn-info btn-default');
		},

		populateLayersList: function(){
        	var container = dom.byId('operational-layers');

        	for(var layer in this.layers){
        		
        		var button = domConstruct.create("button");
        		domAttr.set(button, "id", layer + "-button");
        		domAttr.set(button, "type", "button");
        		domAttr.set(button, "class", "btn btn-default btn-block");
        		button.innerHTML = layer;
        		var clickHandler = lang.hitch(this, "_showLayer", layer);
        		this.own(on(button, "click", clickHandler));
        		domConstruct.place(button, container, "after");
        		//var br = domConstruct.create("br");
        		//domConstruct.place(br, container, "after");
        	}
        },

        _printMap: function(){
			var printer = new Print({
				map: this.map,
				url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
				exportOptions: {
					width: 2000,
					height: 2000,
					dpi: 96
				},
				layout: "A4 Portrait"
			}, dom.byId('print-button'));
			printer.startup();
			//window.print();
		}
	});

});