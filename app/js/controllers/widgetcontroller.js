/*
  The widgetcontroller.js loads all widgets from the config file 

  - It loads the require method so modules can be dynamically loaded
  - It iterates over the array of widgets in the config.json file and 
  	loads the widgets using the path provided as well as the (HTML) node (element)
  - When a new widget is created, the startup method is initialized
*/

/*global define */    // Jshint option to indicate global objects
(function () {
  'use strict';

  define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom", "dojo/dom-construct"
  	], function (require, declare, lang, arrayUtil, dom, domConstruct) {


		// Helper method to return default target or document body  			
  	function target(w) {
  		return w.target || document.body;
 		}

 		// Helper method to create DOM element using configuration node as ID
 		function domNode(w) {
 			return domConstruct.create("div", {
 				id: w.node
 			});
 		}

 		// Helper method that returns default target element or searches for it by ID
 		function targetElem(domTarget) {
 			if (domTarget === document.body) {
 				return domTarget;
 			} else {
 				return dom.byId(domTarget);
 			}
 		}

		return declare(null, {
			constructor: function(options) {
				this.options = options;
			},

			startup: function() {
				arrayUtil.forEach(
					this.options.widgets,
					this._widgetLoader,
					this);

			},

			_widgetLoader: function(widget) {
				lang.mixin(widget.options, this.options);
				this._requireWidget(widget);
			},

			_requireWidget: function(widget) {
				require([widget.path], function(Widget) {
					var node, w;
					if (widget.node) {
						node = domNode(widget);
						domConstruct.place(node, targetElem(target(widget)));
					}
					w = new Widget(widget.options, widget.node);
          // Fix bug when a widget does not have a startup() method
          console.debug(widget.name);
          if (!widget.name === "esri-scalebar")
            w.startup();
				});
			}	
		});	// declare
  }); // define
})();