define([
	'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/topic',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/tasks/ImageServiceIdentifyTask',
	'esri/tasks/ImageServiceIdentifyParameters',
    'esri/layers/MosaicRule',
    'esri/tasks/query',
    'esri/tasks/QueryTask'
	], function(declare, lang, when, Topic, Evented, _WidgetBase,
		 ArcGISImageServiceLayer, ImageServiceIdentifyTask, ImageServiceIdentifyParameters,
		 MosaicRule, Query, QueryTask){
		
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
	        		if(this.mosaicId == "Italy Rice Map") var date = "2014";
	        		else var date = nameToDate(name);
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
	    },

	    getRasterValues: function(pointClicked){
	    	var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "OBJECTID";

            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;

            var identifyTask = new ImageServiceIdentifyTask(this.URL);

            identifyTask.execute(parameters, lang.hitch(this, '_rasterValuesObtained'));
	    },

	     _rasterValuesObtained: function(response){
            var values = response.properties.Values.map(parseFloat);
           	Topic.publish('mosaic/raster-click', values);
        }
	});
});