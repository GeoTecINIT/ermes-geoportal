define([
	'dojo/_base/declare',
	'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/on',
    'dojo/dom',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'text!templates/mainMenu.tpl.html',
    'controllers/MainController',
    'controllers/MonitoringController',
    'controllers/ComparingController',
    'controllers/SettingsController',
    'dojo/domReady!'	
	], function(declare, Evented, lang, when, on, dom, _WidgetBase, _TemplatedMixin,
		 template, MainController, MonitoringController, ComparingController, SettingsController){
		
		return declare([Evented, _WidgetBase, _TemplatedMixin], {
			templateString: template,
			mainController: null,
			monitoringController: null,
			comparingController: null,
			settingsController: null,

			constructor: function(args){
				lang.mixin(this, args);
			},

			postCreate: function(){
				this.monitoringController = new MonitoringController({mosaics: this.mosaics, map: this.map}, 'monitoring-div');
				this.comparingController = new ComparingController({mosaics: this.mosaics, map: this.map}, 'comparing-div');
				this.settingsController = new SettingsController({layers: this.layers, map: this.map}, 'settings-div');
				this.monitoringController.on("raster-selected", lang.hitch(this,"_changeRaster"));
				this.monitoringController.startup();
				this.own(on(dom.byId('monitoring-tab-button'), 'click', lang.hitch(this, '_cancelComparing')));
				this.own(on(dom.byId('monitoring-tab-button'), 'click', lang.hitch(this, '_continueCharting')));

				this.own(on(dom.byId('settings-tab-button'), 'click', lang.hitch(this, '_cancelComparing')));
				
				this.own(on(dom.byId('comparing-tab-button'), 'click', lang.hitch(this, '_cancelCharting')));
				this.own(on(dom.byId('settings-tab-button'), 'click', lang.hitch(this, '_cancelCharting')));
			},

			_cancelCharting: function(){
				this.monitoringController.stopClickHandler();
			},

			_continueCharting: function(){
				this.monitoringController.startClickHandler();
			},

			_cancelComparing: function(){
				this.comparingController.resetSwipeWidget();
			},

			loadMosaics: function(){
				this.monitoringController.populateMosaicsList();
				this.comparingController.populateMosaicsList();
			},

			loadLayers: function(){
				this.settingsController.populateLayersList();
			},


			_changeRaster: function(){
				this.emit('update-raster', {});
			},

			getActiveMosaicAndRaster: function(){
            	return [this.monitoringController.activeMosaic, this.monitoringController.activeRaster];
        	},

	    });
	});
