define([
	'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/MosaicRule',
    'esri/tasks/query',
    'esri/tasks/QueryTask'
	], function(declare, lang, when, Evented, _WidgetBase,
		 ArcGISImageServiceLayer, MosaicRule, Query, QueryTask){
		
		return declare([Evented, _WidgetBase], {
			mosaicId: null,
			name: null,
			description: null,
			URL: null,
			numRasters: 0,
			rasters: [],

		constructor: function(options){
			this.mosaicId = options.id;
			this.URL = options.url;
			this.name = options.name;
			this.description = options.description;
			this.rasters = [];
			this._loadRasters();
	
		},

		getLayerByID: function(rasterId){
			var layer = new ArcGISImageServiceLayer(this.URL);
			var rule = new MosaicRule();
			rule.ascending = true;
			rule.method = MosaicRule.METHOD_LOCKRASTER;
			rule.lockRasterIds = [rasterId];
			layer.setMosaicRule(rule);
			return layer;
		},

		_onQuerySuccess: function(featureSet){		
	        for(var i=0; i<featureSet.features.length; i++){
	        	var key = featureSet.features[i].attributes.OBJECTID;
	        	var name = featureSet.features[i].attributes.Name;

	        	var nameToDate = function(name){
	        		var nameArray = name.split('_');
	       
		        	var day = parseInt(nameArray[nameArray.length-1]);
		        	var year = parseInt(nameArray[nameArray.length-2]);
		        	var dateFromDay = function(year, day){
		        		var date= new Date(year, 0);
		        		date = new Date(date.setDate(day));
		        		return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
		        	}
	        		return dateFromDay(year, day);
	        	}
	        	try{
	        		var date = nameToDate(name);
	        		if(date == "NaN/NaN/NaN") date="Not Avaliable";
	        	} catch (err){
	        		var date = "Not Avaliable";
	        	}
	        	this.rasters[key] = [name, date];
	        }
	        this.numRasters = this.rasters.length;
	        this.emit("mosaic-loaded",{});
      	}, 

		_loadRasters: function(){
			var queryTask = new QueryTask(this.URL);
	        var query = new Query();
	        query.outFields = ['OBJECTID', 'Name'];
	        var querySuccess = lang.hitch(this, "_onQuerySuccess");

	       	queryTask.execute(query).then(querySuccess);	       		       	
	    }
	});
});