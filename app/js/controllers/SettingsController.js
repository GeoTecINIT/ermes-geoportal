define([
	'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/when',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'controllers/MenusController',
    'text!templates/settingsMenu.tpl.html',
    'dojo/domReady!'	
	], function(declare, lang, when, _WidgetBase, _TemplatedMixin,
		 MenusController, template){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,

		constructor: function(){
			console.log("Soy SettingsController");

	    }
	});

});