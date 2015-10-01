define([
	'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/when',
    'dojo/topic',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/tasks/ImageServiceIdentifyTask',
	'esri/tasks/ImageServiceIdentifyParameters',
    'esri/layers/MosaicRule',
    'esri/tasks/query',
    'esri/tasks/QueryTask'
	], function(declare, lang, when, Topic, Evented, _WidgetBase,
		 ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer,
         ImageServiceIdentifyTask, ImageServiceIdentifyParameters,
		 MosaicRule, Query, QueryTask){
		
		return declare([Evented, _WidgetBase], {
			mosaicId: null,
			name: null,
			description: null,
			URL: null,
			hisoticURL: null,
            forecastURL: null,
			numRasters: 0,
			rasters: [],
            currentValues: null,
            avgValues: null,
            stdValues: null,
            forecastValues: null,
            historicDates: [],
            plotType: null,
            yAxis: null,

		constructor: function(options){
			this.mosaicId = options.id;
			this.URL = options.url;
			this.historicURL = options.historicUrl;
            this.forecastURL = options.forecastUrl;
			this.name = options.name;
			this.description = options.description;
			this.rasters = [];
            this.plotType = options.plotType;
            this.yAxis = options.yAxis;
			this._loadRasters();
	
		},

		getLayerByID: function(rasterId){
			var layer = new ArcGISImageServiceLayer(this.URL);
			//var layer = new ArcGISTiledMapServiceLayer(this.URL);
			var rule = new MosaicRule();
			rule.ascending = true;
			//rule.method = MosaicRule.METHOD_LOCKRASTER;
            rule.method = MosaicRule.METHOD_ATTRIBUTE
			//rule.lockRasterIds = [rasterId];
			rule.where = "SDATE='" + rasterId + "'";
            layer.setMosaicRule(rule);
			return layer;
		},

		_onQuerySuccess: function(featureSet){		
	        for(var i=0; i<featureSet.features.length; i++){
	        	var key = featureSet.features[i].attributes.SDATE;
	        	//var key = featureSet.features[i].attributes.OBJECTID;
	        	var name = featureSet.features[i].attributes.Name;
				var date = new Date(featureSet.features[i].attributes.DATE).toDateString();
	        	this.rasters[key] = [name, date];
	        }
	        this.numRasters = this.rasters.length;
	        this.emit("mosaic-loaded",{});
      	}, 

		_loadRasters: function(){
			var queryTask = new QueryTask(this.URL);
	        var query = new Query();
	        query.outFields = ['OBJECTID', 'Name', 'DATE', 'SDATE'];
            query.orderByFields = ["SDATE ASC"];
	        var querySuccess = lang.hitch(this, "_onQuerySuccess");
			var queryError = function(){
				console.debug("Error in the Query");
			} 
	       	queryTask.execute(query).then(querySuccess, queryError);	       		       	
	    },

	    getRasterValues: function(pointClicked){
	    	var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            //mosaicRule.sortField = "OBJECTID";

            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;

            var identifyTask = new ImageServiceIdentifyTask(this.URL);

            if(this.plotType==1)
                identifyTask.execute(parameters, lang.hitch(this, '_rasterValuesObtained'));
            else
                identifyTask.execute(parameters, lang.hitch(this, '_getAVGValues', pointClicked));

	    },

        _getAVGValues: function(pointClicked, response){
            this.currentValues = response.properties.Values.map(parseFloat);

            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            //mosaicRule.sortField = "OBJECTID";
            mosaicRule.where = "PARAMNAME='AVG'";

            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;

            var identifyTask = new ImageServiceIdentifyTask(this.historicURL);
            if(this.plotType==3 || this.plotType==4)
                identifyTask.execute(parameters, lang.hitch(this, '_getSTDValues', pointClicked));
            else if(this.plotType==5)
                identifyTask.execute(parameters, lang.hitch(this, '_getForecastValuesNOStdDv', pointClicked));
            else
                identifyTask.execute(parameters, lang.hitch(this, '_rasterValuesObtained'));
        },

        _getSTDValues: function(pointClicked, response){
            this.avgValues = response.properties.Values.map(parseFloat);
            this.historicDates = [];
            response.catalogItems.features.forEach(lang.hitch(this,function(feature){
                var newYear = parseInt(feature.attributes.SDATE.split('/')[0])+1;
                var newDate = newYear + '/' + feature.attributes.SDATE.split('/')[1]+ '/' + feature.attributes.SDATE.split('/')[2];
                this.historicDates.push(newDate);
            }));

            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            //mosaicRule.sortField = "OBJECTID";
            mosaicRule.where = "PARAMNAME='STD'"

            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;

            var identifyTask = new ImageServiceIdentifyTask(this.historicURL);
            if(this.plotType==4)
                identifyTask.execute(parameters, lang.hitch(this, '_getForecastValues', pointClicked));
            else
                identifyTask.execute(parameters, lang.hitch(this, '_rasterValuesObtained'));
        },

        _getForecastValues: function(pointClicked, response){
            this.stdValues = response.properties.Values.map(parseFloat);

            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            //mosaicRule.sortField = "OBJECTID";

            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;

            var identifyTask = new ImageServiceIdentifyTask(this.forecastURL);
            identifyTask.execute(parameters, lang.hitch(this, '_rasterValuesObtained'));
        },

        _getForecastValuesNOStdDv: function(pointClicked, response){
            this.avgValues = response.properties.Values.map(parseFloat);
            this.historicDates = [];
            response.catalogItems.features.forEach(lang.hitch(this,function(feature){
                var newYear = parseInt(feature.attributes.SDATE.split('/')[0])+1;
                var newDate = newYear + '/' + feature.attributes.SDATE.split('/')[1]+ '/' + feature.attributes.SDATE.split('/')[2];
                this.historicDates.push(newDate);
            }));

            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            //mosaicRule.sortField = "OBJECTID";

            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;

            var identifyTask = new ImageServiceIdentifyTask(this.forecastURL);
            identifyTask.execute(parameters, lang.hitch(this, '_rasterValuesObtained'));
        },

	     _rasterValuesObtained: function(response){
             var parameter = [];

             if(this.plotType==5) {
                 this.forecastValues = response.properties.Values.map(parseFloat);
                 parameter.push(this.currentValues);
                 parameter.push(this.historicDates);
                 parameter.push(this.avgValues);
                 parameter.push(this.forecastValues);
             }

             else if(this.plotType==4) {
                 this.forecastValues = response.properties.Values.map(parseFloat);
                 parameter.push(this.currentValues);
                 parameter.push(this.historicDates);
                 parameter.push(this.avgValues);
                 parameter.push(this.stdValues);
                 parameter.push(this.forecastValues);
             }

             else if(this.plotType==3) {
                 this.stdValues = response.properties.Values.map(parseFloat);
                 parameter.push(this.currentValues);
                 parameter.push(this.historicDates);
                 parameter.push(this.avgValues);
                 parameter.push(this.stdValues);
             }

             else if(this.plotType==2) {
                 this.avgValues = response.properties.Values.map(parseFloat);
                 this.historicDates = [];
                 response.catalogItems.features.forEach(lang.hitch(this,function(feature){
                     var newYear = parseInt(feature.attributes.SDATE.split('/')[0])+1;
                     var newDate = newYear + '/' + feature.attributes.SDATE.split('/')[1]+ '/' + feature.attributes.SDATE.split('/')[2];
                     this.historicDates.push(newDate);
                 }));
                 parameter.push(this.currentValues);
                 parameter.push(this.historicDates);
                 parameter.push(this.avgValues);
             }

             else if(this.plotType==1){
                 this.currentValues = response.properties.Values.map(parseFloat);
                 this.historicDates = [];
                 response.catalogItems.features.forEach(lang.hitch(this,function(feature){
                     var newYear = parseInt(feature.attributes.SDATE.split('/')[0]);
                     var newDate = newYear + '/' + feature.attributes.SDATE.split('/')[1]+ '/' + feature.attributes.SDATE.split('/')[2];
                     this.historicDates.push(newDate);
                 }));
                 parameter.push(this.currentValues);
                 parameter.push(this.historicDates);
             }
             Topic.publish('mosaic/raster-click', parameter);
        }
	});
});