define([
	'dojo/_base/declare',   
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
    'text!templates/monitoringWidget.tpl.html',
    "dojo/topic",
    'dojox/charting/Chart',
    'dojox/charting/themes/PrimaryColors',
    'dojox/charting/plot2d/Lines',
    'dojox/charting/plot2d/StackedLines',
    'dojox/charting/axis2d/Default',
    'dojox/charting/action2d/Tooltip',
    'dojox/charting/widget/Legend',
    'dojo/domReady!'
	], function(declare, lang, on, dom, domConstruct, domAttr,
		_WidgetBase, _TemplatedMixin, template, Topic,
        Chart, theme, Lines, StackedLines, AxisDefault, Tooltip, Legend){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
            actualValue: null,
            rasterValues: null,

		constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){
            this._populateRasterInfo();
            this.own(on(dom.byId('close-chart-button'), 'click', lang.hitch(this, '_closeChart')));
        },

        _populateRasterInfo: function(){
            this._createChart();
        },

        _createChart: function(){
            var seriesValues = this.rasterValues;
            if(this.mosaic.plotType==5) {
                var arrayData = "";
                arrayData += "x,2015,AVG,Forecast\n";
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + "," + seriesValues[2][i] + ",\n";
                    }
                    else if(i < seriesValues[0].length + seriesValues[3].length){
                        arrayData += seriesValues[1][i] + ",," + seriesValues[2][i] + "," + seriesValues[3][i-seriesValues[0].length] + "\n";
                    }
                    else {
                        arrayData += seriesValues[1][i] + ",," + seriesValues[2][i] + ",\n";
                    }
                }
                var graphic = new Dygraph("raster-chart",
                    arrayData,
                    {
                        legend: 'always',
                        ylabel: this.mosaic.yAxis,
                        errorBars: false,
                        showRangeSelector: true
                    }
                );
            }

            else if(this.mosaic.plotType==4) {
                var arrayData = "";
                arrayData += "x,2015,AVG,Forecast\n";
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + ",," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + ",,\n";
                    }
                    else if(i < seriesValues[0].length + seriesValues[4].length){
                        arrayData += seriesValues[1][i] + ",,," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "," + seriesValues[4][i-seriesValues[0].length] + ",\n";
                    }
                    else {
                        arrayData += seriesValues[1][i] + ",,," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + ",,\n";
                    }
                }
                var graphic = new Dygraph("raster-chart",
                    arrayData,
                    {
                        legend: 'always',
                        ylabel: this.mosaic.yAxis,
                        errorBars: true,
                        showRangeSelector: true
                    }
                );
            }
            else if(this.mosaic.plotType==3) {
                var arrayData = "";
                arrayData += "x,2015,AVG\n";
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + ",," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "\n";
                    }
                    else {
                        arrayData += seriesValues[1][i] + ",,," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "\n";
                    }
                }
                var graphic = new Dygraph("raster-chart",
                    arrayData,
                    {
                        legend: 'always',
                        ylabel: this.mosaic.yAxis,
                        errorBars: true,
                        showRangeSelector: true
                    }
                );
            }
            else if(this.mosaic.plotType==2) {
                var arrayData = "";
                arrayData += "x,2015,AVG\n";
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + "," + seriesValues[2][i] + "\n";
                    }
                    else {
                        arrayData += seriesValues[1][i] + ",," + seriesValues[2][i] + "\n";
                    }
                }
                var graphic = new Dygraph("raster-chart",
                    arrayData,
                    {
                        legend: 'always',
                        ylabel: this.mosaic.yAxis,
                        errorBars: false,
                        showRangeSelector: true
                    }
                );
            }
            else{
                var arrayData = "";
                arrayData += "x,2015\n";
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i]  + "\n";
                    }
                }
                var graphic = new Dygraph("raster-chart",
                    arrayData,
                    {
                        legend: 'always',
                        ylabel: this.mosaic.yAxis,
                        errorBars: false,
                        showRangeSelector: true
                    }
                );

            }
        },

        _closeChart: function(){
            Topic.publish("monitoring/close-chart");
            this.destroy();
        }
      
	});

});