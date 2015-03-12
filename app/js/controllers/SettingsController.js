define([
	'dojo/_base/declare',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-class',
	'dojo/dom-construct',
	'dojo/dom-attr',
    'dojo/_base/lang',
    'dojo/when',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'text!templates/settingsMenu.tpl.html',
    'dojo/domReady!'	
	], function(declare, on, dom, domClass, domConstruct, domAttr, lang, when, 
		_WidgetBase, _TemplatedMixin, MenusController, template){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
			baseMaps: ['streets','satellite','hybrid','topo','gray',
						'oceans','national-geographic','osm'],

		constructor: function(args){
			lang.mixin(this, args);
	    },

	    postCreate: function(){
	    	this.own(on(dom.byId('print-button'), 'click', lang.hitch(this, '_printMap')));
	    	this._populateBaseMaps();
	    },

	    _populateBaseMaps: function(){
	    	var container = dom.byId('basemap-list-ul');
	    	
	    	for(bm in this.baseMaps){
	    		var base = this.baseMaps[bm];
	    		var a = domConstruct.create('a');
	    		domAttr.set(a, "href", "#");
	    		domAttr.set(a, "id", base);
	    		a.innerHTML = base;
	    		var clickHandler = lang.hitch(this, "_changeBaseMap", base);
	    		this.own(on(a, "click", clickHandler));
	    		var li = domConstruct.create('li');
	    		domConstruct.place(a,li,"only");
	    		domConstruct.place(li,container,"last");
	    	}
	    },

	    _changeBaseMap: function(baseMap){
	    	this.map.setBasemap(baseMap);
	    },

		_showLayer: function(id){
			var layer = this.map.getLayer(id);
			if( layer == null){
				layer = this.layers[id];
				this.map.addLayer(layer);
			}
			else{
				this.map.removeLayer(layer)
			}
			domClass.toggle(dom.byId(id + "-button"), 'btn-info btn-default');
		},

		populateLayersList: function(){
        	var container = dom.byId('operational-layers');

        	for(var layer in this.layers){
        		
        		var button = domConstruct.create("button");
        		domAttr.set(button, "id", layer + "-button");
        		domAttr.set(button, "type", "button");
        		domAttr.set(button, "class", "btn btn-info");
        		button.innerHTML = layer;
        		var clickHandler = lang.hitch(this, "_showLayer", layer);
        		this.own(on(button, "click", clickHandler));
        		domConstruct.place(button, container, "after");
        		var br = domConstruct.create("br");
        		domConstruct.place(br, container, "after");
        	}
        },

        _printMap: function(){
			window.print();
		}
	});

});