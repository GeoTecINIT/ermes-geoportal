define([
	'dojo/_base/declare',   
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-class',
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
	], function(declare, lang, on, dom, domConstruct, domAttr, domClass,
		_WidgetBase, _TemplatedMixin, template, Topic,
        Chart, theme, Lines, StackedLines, AxisDefault, Tooltip, Legend){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
            actualValue: null,
            rasterValues: null,
            graphic: null,
            downloadLink: null,

		constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){
            this._populateRasterInfo();
            this.own(on(dom.byId('close-chart-button'), 'click', lang.hitch(this, '_closeChart')));
            this.own(on(dom.byId('export-chart-button'), 'click', lang.hitch(this, '_exportChart')));
            this.own(on(dom.byId('export-csv-button'), 'click', lang.hitch(this, '_exportCSV')));
        },

        _populateRasterInfo: function(){
            this._createChart();
        },

        _createChart: function(){
            var seriesValues = this.rasterValues;
            if(this.mosaic.plotType==5) {
                var arrayData = "";
                arrayData += "x,2015,AVG,Forecast\n";
                var csvHeader = ["date", "currValue", "avg", "forecast"];
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
                this.graphic = new Dygraph("raster-chart",
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
                var csvHeader = ["date", "currValue", "currValStdDev", "avg", "avgStdDev", "forecast", "forecastStdDev"];
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
                this.graphic = new Dygraph("raster-chart",
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
                var csvHeader = ["date", "currValue", "currStdDev", "avg", "avgStdDev"];
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + ",," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "\n";
                    }
                    else {
                        arrayData += seriesValues[1][i] + ",,," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "\n";
                    }
                }
                this.graphic = new Dygraph("raster-chart",
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
                var csvHeader = ["date", "currValue", "avg"];
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + "," + seriesValues[2][i] + "\n";
                    }
                    else {
                        arrayData += seriesValues[1][i] + ",," + seriesValues[2][i] + "\n";
                    }
                }
                this.graphic = new Dygraph("raster-chart",
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
                var csvHeader = ["date", "currValue"];
                for (var i = 0; i < seriesValues[1].length; i++) {
                    if (i < seriesValues[0].length) {
                        arrayData += seriesValues[1][i] + "," + seriesValues[0][i]  + "\n";
                    }
                }
                this.graphic = new Dygraph("raster-chart",
                    arrayData,
                    {
                        legend: 'always',
                        ylabel: this.mosaic.yAxis,
                        errorBars: false,
                        showRangeSelector: true
                    }
                );

            }



            var rows = arrayData.split('\n');
            var downloadableData = [];
            for(var i = 0; i<rows.length; i++){
                downloadableData.push(rows[i].split(','));

            }
            downloadableData.shift();
            downloadableData.unshift(csvHeader);

            csvContent = "data:text/csv;charset=utf-8,";
            downloadableData.forEach(function(infoArray, index){

                dataString = infoArray.join(";");
                csvContent += index < downloadableData.length ? dataString+ "\n" : dataString;

            });

            var encodedUri = encodeURI(csvContent);
            link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "csvData.csv");

            this.downloadLink = link;



            var titleSelected = this.mosaicName;
            var valueClicked = "Value for " + this.actualTimePosition + " in the selected point is: "+ "<b>" + this.actualValue + "</b>";

            var titleDiv = dom.byId("chart-title");
            var valueDiv = dom.byId("chart-current-value");
            titleDiv.innerHTML = titleSelected;
            valueDiv.innerHTML = valueClicked;

            var plotDiv = dom.byId("monitoring-widget-div");

            if(domClass.contains(plotDiv, "display-none")){
                domClass.remove(plotDiv, "display-none");
                domClass.add(plotDiv, "display-block");
            }

        },


        _exportCSV: function(){
            this.downloadLink.click();
        },

        _closeChart: function(){
            var plotDiv = dom.byId("monitoring-widget-div");

            if(domClass.contains(plotDiv, "display-block")){
                domClass.remove(plotDiv, "diplay-block");
                domClass.add(plotDiv, "display-none");
            }

            Topic.publish("monitoring/close-chart");
            this.destroy();

        },

        _exportChart: function(){
            var img = dom.byId("raster-chart");

            html2canvas(img,{
                onrendered: function(canvas){
                    canvas.toBlob(function(blob) {
                        saveAs(blob, "PlotImage.png");
                    });
                }
            });
        }
	});

});