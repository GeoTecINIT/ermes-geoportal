define([
	'dojo/_base/declare',
	'dojo/Evented',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/on',
    'dojo/dom',
	'dojo/dom-construct',
	"dojo/topic",
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'text!templates/mainMenu.tpl.html',
    'controllers/MainController',
    'controllers/MonitoringController',
    'controllers/ComparingController',
    'controllers/SettingsController',
	'controllers/FinderController',
	'widgets/CoordinatesWidget',
    'dojo/domReady!'	
	], function(declare, Evented, lang, when, on, dom, domConstruct, Topic, _WidgetBase, _TemplatedMixin,
		 template, MainController, MonitoringController, ComparingController, SettingsController, FinderController, CoordinatesWidget){
		
		return declare([Evented, _WidgetBase, _TemplatedMixin], {
			templateString: template,
			mainController: null,
			monitoringController: null,
			comparingController: null,
			settingsController: null,
			coordinatesWidget: null,
			finderController: null,


			constructor: function(args){
				lang.mixin(this, args);
			},

			postCreate: function(){
				this.monitoringController = new MonitoringController({
					mosaics: this.mosaics,
					map: this.map,
					userProfile: this.userProfile,
					userRegion: this.userRegion,
					username: this.username,
					parcelsLayer: this.parcelsLayer,
					limits: this.limits,
					urlServer: this.urlServer,
					apiVersion: this.apiVersion
				}, 'monitoring-div');
				this.comparingController = new ComparingController({
					mosaics: this.mosaics,
					map: this.map,
					urlServer: this.urlServer}, 'comparing-div');
				this.settingsController = new SettingsController({
					layers: this.layers,
					map: this.map,
					urlServer: this.urlServer}, 'settings-div');
				this.coordinatesWidget = new CoordinatesWidget({
					map: this.map,
					limits: this.limits,
					urlServer: this.urlServer
					}, 'coordinates-div');
				if(this.finder) {
					this.finderController = new FinderController({
						map: this.map,
						urlServer: this.urlServer
					}, 'finder-div');
				}
				this.monitoringController.on("raster-selected", lang.hitch(this,"_changeRaster"));
				this.monitoringController.on("raster-selected-none", lang.hitch(this,"_noneSelected"));
				this.monitoringController.startup();
				this.own(on(dom.byId('monitoring-div-container'), 'click', lang.hitch(this, '_cancelComparing')));
				this.own(on(dom.byId('monitoring-div-container'), 'click', lang.hitch(this, '_continueCharting')));

				//this.own(on(dom.byId('settings-div-container'), 'click', lang.hitch(this, '_cancelComparing')));
				this.own(on(dom.byId('close-comparing-button'), 'click', lang.hitch(this, '_cancelComparing')));
				
				//this.own(on(dom.byId('comparing-div-container'), 'click', lang.hitch(this, '_cancelCharting')));
				//this.own(on(dom.byId('settings-div-container'), 'click', lang.hitch(this, '_cancelCharting')));
				this.own(on(dom.byId('logout-button'), 'click', lang.hitch(this, '_logout')));
			},

			_logout: function(){
				//var delete_cookie = function(name) {
				//	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				//};
				localStorage.removeItem("region");
				localStorage.removeItem("profile");
				localStorage.removeItem("password");
				localStorage.removeItem("username");
				//delete_cookie("region");
				//delete_cookie("profile");
				//delete_cookie("username");
				window.location.replace("login.html");
			},

			_cancelCharting: function(){

				Topic.publish('cancel-legend',{});
				this.monitoringController.stopClickHandler();
				this.monitoringController.destroyChart();
				this.monitoringController.closeSwipe();
			},

			_continueCharting: function(){
				this.monitoringController.startClickHandler();
			},

			_cancelComparing: function(){
				Topic.publish('enable-legend',{});
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
				this.emit('update-raster', this.monitoringController.getActiveMosaicAndRaster());

			},

			_noneSelected: function(){
				$('time-slider-container-div').removeClass('display-block').addClass('display-none');
				this.emit('remove-raster', {});


			},

			getActiveMosaicAndRaster: function(){
            	return [this.monitoringController.activeMosaic, this.monitoringController.activeRaster];
        	},

	    });
	});
