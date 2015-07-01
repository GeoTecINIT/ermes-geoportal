define([
	'dojo/_base/declare',
	'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/on',
    'dojo/dom',
	'dojo/dom-construct',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'text!templates/mainMenu.tpl.html',
    'controllers/MainController',
    'controllers/MonitoringController',
    'controllers/ComparingController',
    'controllers/SettingsController',
    'dojo/domReady!'	
	], function(declare, Evented, lang, when, on, dom, domConstruct, _WidgetBase, _TemplatedMixin,
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
				this.monitoringController.on("raster-selected-none", lang.hitch(this,"_noneSelected"));
				this.monitoringController.startup();
				this.own(on(dom.byId('monitoring-tab-button'), 'click', lang.hitch(this, '_cancelComparing')));
				this.own(on(dom.byId('monitoring-tab-button'), 'click', lang.hitch(this, '_continueCharting')));

				this.own(on(dom.byId('settings-tab-button'), 'click', lang.hitch(this, '_cancelComparing')));
				
				this.own(on(dom.byId('comparing-tab-button'), 'click', lang.hitch(this, '_cancelCharting')));
				this.own(on(dom.byId('settings-tab-button'), 'click', lang.hitch(this, '_cancelCharting')));

				this.own(on(dom.byId('logout-button'), 'click', lang.hitch(this, '_logout')));
			},

			_logout: function(){
				var delete_cookie = function(name) {
					document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				};
				delete_cookie("region");
				delete_cookie("profile");
				delete_cookie("username");
				window.location.replace("login.html");
			},

			_cancelCharting: function(){
				this.monitoringController.stopClickHandler();
				this.monitoringController.destroyChart();
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

			_noneSelected: function(){
				this.emit('remove-raster', {});
			},

			getActiveMosaicAndRaster: function(){
            	return [this.monitoringController.activeMosaic, this.monitoringController.activeRaster];
        	},

	    });
	});
