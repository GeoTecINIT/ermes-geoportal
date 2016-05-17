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
    'dojo/request/xhr',
    "esri/geometry/Point",
    "esri/geometry/Extent",
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/SpatialReference",
    "esri/layers/RasterFunction"

	], function(declare, lang, when, Topic, Evented, _WidgetBase,
		ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer,
        ImageServiceIdentifyTask, ImageServiceIdentifyParameters,
		MosaicRule, xhr, Point, Extent, Query, QueryTask, GeometryService, ProjectParameters,
        SpatialReference, RasterFunction){
		
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
            valuesReceived: 0,
            parameterForPlot: [],
            limits: null,
            currentValuesDate: null,
            avgValuesDate: null,
            stdValuesDate: null,
            forecastValuesDate: null,
            year: null,
            legendURL: null,

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
            this.year = options.year;
            this.legendURL = options.legendURL;
            this._getMosaicExtent();
			this._loadRasters();
		},

        _createLimits: function(arrayPoints){
            var xmin = arrayPoints[0].x;
            var ymin = arrayPoints[0].y;
            var xmax = arrayPoints[1].x;
            var ymax = arrayPoints[1].y;
            var sr = new SpatialReference({"wkid": arrayPoints[0].spatialReference.wkid});
            this.limits = new Extent(xmin, ymin, xmax, ymax, sr);
        },

        _projectExtent: function(response){
            var geometries = [];
            console.log(response.extent);
            geometries.push(new Point(
                response.extent.xmin,
                response.extent.ymin,
                new SpatialReference({ wkid: response.extent.spatialReference.wkid })
            ));
            geometries.push(new Point(
                response.extent.xmax,
                response.extent.ymax,
                new SpatialReference({ wkid: response.extent.spatialReference.wkid })
            ));
            //var geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var geometryService = new GeometryService("http://ermes.dlsi.uji.es:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
            var params = new ProjectParameters();
            params.geometries = geometries;
            params.outSR = new SpatialReference(4326) ;
            var setLimits = lang.hitch(this, "_createLimits");
            geometryService.project(params).then(setLimits);
        },

        _getMosaicExtent: function(){
            var mosaicDataUrl = this.URL + '?f=pjson';
            var project = lang.hitch(this, "_projectExtent");
            xhr(mosaicDataUrl, {
                handleAs: "json",
                headers: {"X-Requested-With": null }
            }).then(project);
        },

		getLayerByID: function(rasterId){
            var layer = new ArcGISImageServiceLayer(this.URL, {
                displayLevels: [9, 10, 11, 12, 13, 14, 15, 16, 17]
            });
            //var layer = new ArcGISImageServiceLayer(this.URL);

			var rule = new MosaicRule();
			rule.ascending = true;
			//rule.method = MosaicRule.METHOD_LOCKRASTER;
            rule.method = MosaicRule.METHOD_ATTRIBUTE;
			//rule.lockRasterIds = [rasterId];
			rule.where = "SDATE='" + rasterId + "'";
            layer.setMosaicRule(rule);

            //TESTING RENDERING RULE
            //var rasterFunction = new RasterFunction();
            //rasterFunction.functionName = "SpirituKalkat";
            //layer.setRenderingRule(rasterFunction);


			return layer;
		},

		_onQuerySuccess: function(featureSet){		
	        for(var i=0; i<featureSet.features.length; i++){
	        	var key = featureSet.features[i].attributes.SDATE;
	        	//var key = featureSet.features[i].attributes.OBJECTID;
	        	var name = featureSet.features[i].attributes.Name;
				var date = new Date(featureSet.features[i].attributes.DATE).toDateString();
	        	this.rasters[key] = [name, date];
                this.rasters.length++;
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
            //PlotType
            //0-No Plot. 1-One Serie (Value). 2- Two Series (Value + Avg). 3- Two Series + Error (Value + Avg + StdDV).
            //4-Three Series (Value + Forecast + Avg + StdDV). 5-Three Series without StdDv (Value + Forecast + Avg)
            this._getCurrentValues(pointClicked);
            switch(this.plotType){
                case 2:
                    this._getAVGValues(pointClicked);
                    break;
                case 3:
                    this._getAVGValues(pointClicked);
                    this._getSTDValues(pointClicked);
                    break;
                case 4:
                    this._getAVGValues(pointClicked);
                    this._getSTDValues(pointClicked);
                    this._getForecastValues(pointClicked);
                    break;
                case 5:
                    this._getAVGValues(pointClicked);
                    this._getForecastValues(pointClicked);
                    break;
                default:
                    break;

            }

	    },

        _getCurrentValues: function(pointClicked){
            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;
            var identifyTask = new ImageServiceIdentifyTask(this.URL);
            identifyTask.execute(parameters, lang.hitch(this, '_setCurrentValues'));
        },

        _createArrayFromResponse: function(r, historic){
            var i = 0;
            var array = []
            r.catalogItems.features.forEach(lang.hitch(this,function(feature){
                var newYear = parseInt(feature.attributes.SDATE.split('/')[0]) + historic;
                var newDate = newYear + '/' + feature.attributes.SDATE.split('/')[1]+ '/' + feature.attributes.SDATE.split('/')[2];
                array[newDate] =  r.properties.Values[i];
                array.length++;
                i++;
            }));
            return array;
        },

        _setCurrentValues: function(response){
            this.currentValues = response.properties.Values.map(parseFloat);

            var getArray = lang.hitch(this, "_createArrayFromResponse");
            this.currentValuesDate = getArray(response, 0);

            if(this.plotType==1){
                this.historicDates = [];
                response.catalogItems.features.forEach(lang.hitch(this,function(feature){
                    var newYear = parseInt(feature.attributes.SDATE.split('/')[0]);
                    var newDate = newYear + '/' + feature.attributes.SDATE.split('/')[1]+ '/' + feature.attributes.SDATE.split('/')[2];
                    this.historicDates.push(newDate);
                }));
            }
            this._responseFinished();
        },

        _getAVGValues: function(pointClicked){
            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            mosaicRule.where = "PARAMNAME='AVG'";
            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;
            var identifyTask = new ImageServiceIdentifyTask(this.historicURL);
            identifyTask.execute(parameters, lang.hitch(this, '_setAVGValues'));
        },

        _setAVGValues: function(response){
            this.avgValues = response.properties.Values.map(parseFloat);

            var getArray = lang.hitch(this, "_createArrayFromResponse");
            this.avgValuesDate = getArray(response, 1);

            if(this.plotType!=1){
                this.historicDates = [];
                response.catalogItems.features.forEach(lang.hitch(this,function(feature){
                    var newYear = parseInt(feature.attributes.SDATE.split('/')[0])+1;
                    var newDate = newYear + '/' + feature.attributes.SDATE.split('/')[1]+ '/' + feature.attributes.SDATE.split('/')[2];
                    this.historicDates.push(newDate);
                }));
            }
            this._responseFinished();
        },

        _getSTDValues: function(pointClicked){
            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            mosaicRule.where = "PARAMNAME='STD'"
            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;
            var identifyTask = new ImageServiceIdentifyTask(this.historicURL);
            identifyTask.execute(parameters, lang.hitch(this, '_setSTDValues'));
        },

        _setSTDValues: function(response){
            this.stdValues = response.properties.Values.map(parseFloat);


            var getArray = lang.hitch(this, "_createArrayFromResponse");
            this.stdValuesDate = getArray(response, 1);

            this._responseFinished();
        },

        _getForecastValues: function(pointClicked){
            var mosaicRule = new MosaicRule();
            mosaicRule.ascending = true;
            mosaicRule.method = MosaicRule.METHOD_ATTRIBUTE;
            mosaicRule.sortField = "DATE";
            var parameters = new ImageServiceIdentifyParameters();
            parameters.mosaicRule = mosaicRule;
            parameters.geometry = pointClicked;

            var identifyTask = new ImageServiceIdentifyTask(this.forecastURL);
            identifyTask.execute(parameters, lang.hitch(this, '_setForecastValues'));
        },

        _setForecastValues: function(response){
            this.forecastValues = response.properties.Values.map(parseFloat);

            var getArray = lang.hitch(this, "_createArrayFromResponse");
            this.forecastValuesDate = getArray(response, 0);

            this._responseFinished();
        },

        _responseFinished: function(){
            this.valuesReceived++;
            if(this.plotType==5) {
                if(this.valuesReceived==3)
                    this._rasterValuesObtained();
            }

            else if(this.plotType==4) {
                if(this.valuesReceived==4)
                    this._rasterValuesObtained();
            }

            else if(this.plotType==3) {
                if(this.valuesReceived==3)
                    this._rasterValuesObtained();
            }

            else if(this.plotType==2) {
                if(this.valuesReceived==2)
                    this._rasterValuesObtained();
            }

            else if(this.plotType==1) {
                    this._rasterValuesObtained();
            }
        },

	     _rasterValuesObtained: function(){
             var parameter = [];
             parameter.push(this.currentValues);
             parameter.push(this.historicDates);
             if(this.plotType==5) {
                 parameter.push(this.avgValues);
                 parameter.push(this.forecastValues);
             }

             else if(this.plotType==4) {
                 parameter.push(this.avgValues);
                 parameter.push(this.stdValues);
                 parameter.push(this.forecastValues);
             }

             else if(this.plotType==3) {
                 parameter.push(this.avgValues);
                 parameter.push(this.stdValues);
             }

             else if(this.plotType==2) {
                 parameter.push(this.avgValues);
             }

             var dataObject = {};
             dataObject.currentValues = this.currentValuesDate;
             dataObject.avgValues = this.avgValuesDate;
             dataObject.stdValues = this.stdValuesDate;
             dataObject.forecastValues= this.forecastValuesDate;

             this.valuesReceived=0;
             Topic.publish('mosaic/raster-click', parameter, dataObject);
        }
	});
});