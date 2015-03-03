define([
	'dojo/_base/declare',
	'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'text!templates/mainMenu.tpl.html',
    'controllers/MainController',
    'controllers/MonitoringController',
    'controllers/ComparingController',
    'controllers/SettingsController',
    'dojo/domReady!'	
	], function(declare, Evented, lang, when, _WidgetBase, _TemplatedMixin,
		 template, MainController, MonitoringController, ComparingController, SettingsController){
		
		return declare([Evented, _WidgetBase, _TemplatedMixin], {
			templateString: template,
			mainController: null,
			monitoringController: null,
			comparingController: null,
			settingsController: null,

			constructor: function(args){
				console.log("Soy MenusController");
				lang.mixin(this, args);
			},

			postCreate: function(){
				this.monitoringController = new MonitoringController({mosaics: this.mosaics, map: this.map}, 'monitoring-div');
				this.comparingController = new ComparingController({}, 'comparing-div');
				this.settingsController = new SettingsController({layers: this.layers, map: this.map}, 'settings-div');
				this.monitoringController.on("raster-selected", lang.hitch(this,"_changeRaster"));
				this.monitoringController.startup();
			},

			loadMosaics: function(){
				this.monitoringController.populateMosaicsList();
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
