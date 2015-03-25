define([
	'dojo/_base/declare',   
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'esri/dijit/LayerSwipe',
    'text!templates/comparingSwipeWidget.tpl.html',
    'dojo/domReady!'	
	], function(declare, lang, on, dom, domConstruct, domAttr,
		_WidgetBase, _TemplatedMixin, LayerSwipe, template){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
            swipe: null,

		constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){

            this._showSwipe();
        },

        _showSwipe: function(){

            var constructSwipe = function(){
                var swipeDiv = domConstruct.create("div");
                domAttr.set(swipeDiv, "id", "swipe-tool");
                var container = dom.byId("map-index-div");
                domConstruct.place(swipeDiv, container, "first");
            }
            constructSwipe();
            var layerSwipe = this.secondaryLayer;
            layerSwipe.setOpacity(0.7);
            this.swipe = new LayerSwipe({
                type: "vertical",
                map: this.map,
                layers: [layerSwipe]
            }, "swipe-tool");

            this.swipe.startup();

        },

        destroySwipe: function(){
            this.swipe.destroy();
        }
      
	});

});