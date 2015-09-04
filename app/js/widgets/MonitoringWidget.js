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
    'dojox/charting/Chart',
    'dojox/charting/themes/PrimaryColors',
    'dojox/charting/plot2d/Lines',
    'dojox/charting/plot2d/StackedLines',
    'dojox/charting/axis2d/Default',
    'dojox/charting/action2d/Tooltip',
    'dojox/charting/widget/Legend',
    'dojo/domReady!'
	], function(declare, lang, on, dom, domConstruct, domAttr,
		_WidgetBase, _TemplatedMixin, template, 
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
            //var labelSeries ="[";
            //var dojoFormatSeries = "[";
            //var seriesValues = this.rasterValues;
            //var i = 0;
            //var currentPos = this.actualTimePosition;
            //var currentVal = 0;
            //var posMarker = 0;
            //
            //function createSeries(element, index, array){
            //    //console.log("Index: " + index);
            //    //console.log("PosAcual: " + posActual)
            //    if(index==currentPos) {
            //        posMarker = i + 1;
            //        currentVal = seriesValues[0][i];
            //    }
            //
            //    var showingDate = element[1];
            //    showingDate = showingDate.split(' ');
            //    showingDate= showingDate[2] + " " + showingDate[1];
            //    if(!isNaN(seriesValues[0][i])) {
            //        dojoFormatSeries += '{"tooltip": "Value:' + seriesValues[0][i].toString() + ' .", "y": ' + seriesValues[0][i] + '}';
            //    }
            //    else{
            //        dojoFormatSeries += '{"tooltip": "' + "No value" + ' .", "y": ' + 0 + '}';
            //    }
            //    labelSeries += '{"value": ' + i + ', "text": "' + showingDate + '"}';
            //    if (i<seriesValues[0].length-1){
            //        labelSeries+=',';
            //        dojoFormatSeries+=',';
            //    }
            //    else{
            //        labelSeries+=']';
            //        dojoFormatSeries+=']';
            //    }
            //    i++;
            //
            //}
            //
            //this.mosaic.rasters.forEach(createSeries);
            //console.log(posMarker);
            //
            //
            //var contenedor = dom.byId("raster-data");
            //contenedor.innerHTML = "<span><h4 class='text-info'>Value: <b>" + currentVal + "</b></h4></span>";
            //
            //labelSeries = JSON.parse(labelSeries);
            //dojoFormatSeries = JSON.parse(dojoFormatSeries);
            //
            //
            //if(seriesValues.length>1){
            //    i=0;
            //    var newSerie1 ="[";
            //   // labelSeries ="[";
            //    function createAditionalSeries(element, index, array){
            //
            //        if(!isNaN(element)) {
            //            newSerie1 += '{"tooltip": "Value:' + element.toString() + ' .", "y": ' + element + '}';
            //        }
            //        else{
            //            newSerie1 += '{"tooltip": "' + "No value" + ' .", "y": ' + 0 + '}';
            //        }
            //
            //        if (i<seriesValues[1].length-1){
            //            newSerie1+=',';
            //        }
            //        else{
            //            newSerie1+=']';
            //        }
            //        i++;
            //    }
            //    seriesValues[1].forEach(createAditionalSeries)
            //    newSerie1 = JSON.parse(newSerie1);
            //
            //}
            //
            ////serieComplete = JSON.parse(serieComplete);
            //
            //var chart = new Chart("raster-chart");
            //chart.setTheme(theme);
            //
            //chart.addPlot("default", {
            //    min: 0,
            //    type: StackedLines,
            //    tension: "S",
            //    markers: true,
            //    fontColor: "black",
            //    labelOffset: -20
            //});
            //
            //chart.addPlot("plot2", {
            //    min: 0,
            //    type: StackedLines,
            //    tension: "S",
            //    markers: true,
            //    fontColor: "black",
            //    labelOffset: -20
            //});
            //
            //chart.addPlot("plot3", {
            //    min: 0,
            //    type: StackedLines,
            //    tension: "S",
            //    markers: true,
            //    fontColor: "black",
            //    labelOffset: -20
            //});
            //
            //chart.addAxis("x", {
            //    min: 1,
            //    title: "Timeline",
            //    titleOrientation: "away",
            //    fixLower: "minor",
            //    fixUpper: "major",
            //    majorTick: { length: 3 },
            //    includeZero: true,
            //    natural: true,
            //    labels: labelSeries
            //});
            //
            //chart.addAxis("y", {
            //    vertical: true,
            //    fixLower: 0,
            //    fixUpper: 9000,
            //    title: this.mosaicName,
            //    titleOrientation: "axis"
            //});
            //
            //
            //
            //chart.addSeries("Actual Position",
            //    [{x: posMarker, y: currentVal, tooltip: 'Value:' + currentVal + ' .'}]);
            //
            //chart.addSeries(this.mosaicName,
            //    dojoFormatSeries, {plot: "plot2"});
            //
            //
            //
            //if(seriesValues.length>1){
            //    chart.addSeries("AVG",
            //        newSerie1, {plot: "plot3"});
            //}
            //
            ////chart.addSeries(this.mosaicName,
            ////    this.rasterValues);
            //var tip = new Tooltip(chart, "default");
            //var tip2 = new Tooltip(chart, "plot2");
            //var tip3 = new Tooltip(chart, "plot3");
            //chart.render();
            //var legend = new Legend({ chart: chart }, "legend");
            //var data_prop = 'data';
            //var fields = ['dataSerie1', 'dataSerie2'];
            //var sampledata = { data:
            //    [{'dataSerie1': 0.5, 'dataSerie2': 0.8, time: '2011-05-16'},
            //        {'dataSerie1': 0.6, 'dataSerie2': 0.9, time: '2011-06-16'},
            //        {'dataSerie1': 1.0, 'dataSerie2': 0.9, time: '2011-07-16'}] };
            //
            //var linear = linearChart(null, fields, data_prop, "raster-chart", 'chart2')
            //    .dataproperty('data')
            //    .datasource(sampledata)
            //    .title("A title")
            //    .subtitle("A subtitle.")
            //   /* .width(200)
            //    .height(300)*/
            //    .load();

            var seriesValues = this.rasterValues;
            //console.log(this.mosaic.plotType);

            if(this.mosaic.plotType==4) {
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
                        //labels: ["x", "Value", "Average"],
                        legend: 'always',
                        //title: this.mosaicName,
                        ylabel: this.mosaic.yAxis,
                        errorBars: true,
                        //customBars: true,
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
                        //labels: ["x", "Value", "Average"],
                        legend: 'always',
                        //title: this.mosaicName,
                        ylabel: this.mosaic.yAxis,
                        errorBars: true,
                        //customBars: true,
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
                        //labels: ["x", "Value", "Average"],
                        legend: 'always',
                        //title: this.mosaicName,
                        ylabel: this.mosaic.yAxis,
                        errorBars: false,
                        //customBars: true,
                        showRangeSelector: true
                    }
                );
            }
            else{
                var arrayData = [];
                var i = 0;
                this.mosaic.rasters.forEach(function(data){
                    var point = [new Date(data[1]), seriesValues[0][i]];
                    arrayData.push(point);
                    i++;
                });

                var a = new Dygraph("raster-chart",
                    arrayData,
                    {
                        labels: ["x", "2015"],
                        legend: 'always',
                        //title: this.mosaicName,
                        ylabel: this.mosaic.yAxis,
                        showRangeSelector: true
                    }
                );
            }

        },

        _closeChart: function(){
            this.destroy();
        }
      
	});

});