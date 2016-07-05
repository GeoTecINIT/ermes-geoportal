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
            if(localStorage.language)
                SetLanguage(localStorage.language);
            else SetLanguage("en");
        },

        _populateRasterInfo: function(){
            this._createChart();
        },

        _createChart: function(){
            var seriesValues = this.rasterValues;

            ////TODO Other way of doing this, refactor when forectast column will be added.

            var dataToArray = function(collection){
               array = [];
               i=0;
               for(var index in collection){
                   array.push([new Date(index), collection[index]]);
                   i++;
               }

               return array;
            }

            var currentArray = dataToArray(this.dataObject.currentValues);
            var avgArray = dataToArray(this.dataObject.avgValues);
            var stdArray = dataToArray(this.dataObject.stdValues);
            var forecastArray = dataToArray(this.dataObject.forecastValues);


            var valores = _.zipObject(_.unzip(currentArray)[0], _.unzip(currentArray)[1]);
            var medias = _.zipObject(_.unzip(avgArray)[0], _.unzip(avgArray)[1]);
            var desviaciones = _.zipObject(_.unzip(stdArray)[0], _.unzip(stdArray)[1]);
            var predicciones = _.zipObject(_.unzip(forecastArray)[0], _.unzip(forecastArray)[1]);

            var todasLasFechas = _.chain([])
               .concat(_.keys(valores))
               .concat(_.keys(medias))
               .concat(_.keys(desviaciones))
               .concat(_.keys(predicciones))
               .uniq()
               .value();

            _.map(todasLasFechas, function(fecha) {
               if( ! _.has(valores, fecha) ) valores[fecha] = "";
               if( ! _.has(medias, fecha) ) medias[fecha] = "";
               if( ! _.has(desviaciones, fecha) ) desviaciones[fecha] = "";
               if( ! _.has(predicciones, fecha) ) predicciones[fecha] = "";
            });


            var resultado = _.map(todasLasFechas, function(fecha, i) {
               return [new Date(fecha), valores[fecha], medias[fecha], desviaciones[fecha], predicciones[fecha]];
            });

            var arrayData="";
            var error = false;

            function formatDate(date){
                var month = (parseInt(date.getMonth()) + 1).toString();
                if (month.length<2) month = "0" + month;

                var day = date.getDate().toString();
                if (day.length<2) day = "0" + day;

                var year = date.getFullYear();
                return  year +  "/" + month + "/" + day;
            }

            if(this.mosaic.plotType==3 || this.mosaic.plotType==4){
               error=true;
               // arrayData += "x,2015,std,AVG,std,Forecast,std\n";
               arrayData += "x," + this.mosaic.year + ",AVG,Forecast\n";
               var csvHeader = ["date", "currValue", "currValStdDev", "avg", "avgStdDev", "forecast", "forecastStdDev"];
               for(var i = 0; i<resultado.length; i++){
                   arrayData += formatDate(new Date(resultado[i][0])) + "," + resultado[i][1] + ",," + resultado[i][2] + "," + resultado[i][3] + "," + resultado[i][4] + ",\n";
               }
            }
            else if(this.mosaic.plotType==1 || this.mosaic.plotType==2 || this.mosaic.plotType==5) {
               arrayData += "x,2015,AVG,Forecast\n";
               var csvHeader = ["date", "currValue", "avg", "forecast"];
               for (var i = 0; i < resultado.length; i++) {
                   arrayData+= new Date(resultado[i][0]) + "," + resultado[i][1] + "," + resultado[i][2] + ","  + resultado[i][4] + "\n";
               }
            }


            this.graphic = new Dygraph("raster-chart",
               arrayData,
               {
                   legend: 'always',
                   ylabel: this.mosaic.yAxis,
                   errorBars: error,
                   showRangeSelector: true
               }
            );

            //Create Charts:

            // if(this.mosaic.plotType==5) {
            //     var arrayData = "";
            //     arrayData += "x," + this.mosaic.year + ",AVG,Forecast\n";
            //     var csvHeader = ["date", "currValue", "avg", "forecast"];
            //     for (var i = 0; i < seriesValues[1].length; i++) {
            //         if (i < seriesValues[0].length) {
            //             arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + "," + seriesValues[2][i] + ",\n";
            //         }
            //         else if(i < seriesValues[0].length + seriesValues[3].length){
            //             arrayData += seriesValues[1][i] + ",," + seriesValues[2][i] + "," + seriesValues[3][i-seriesValues[0].length] + "\n";
            //         }
            //         else {
            //             arrayData += seriesValues[1][i] + ",," + seriesValues[2][i] + ",\n";
            //         }
            //     }
            //     this.graphic = new Dygraph("raster-chart",
            //         arrayData,
            //         {
            //             legend: 'always',
            //             ylabel: this.mosaic.yAxis,
            //             errorBars: false,
            //             showRangeSelector: true
            //         }
            //     );
            // }
            // else if(this.mosaic.plotType==4) {
            //     var arrayData = "";
            //     arrayData += "x," + this.mosaic.year + ",AVG,Forecast\n";
            //     var csvHeader = ["date", "currValue", "currValStdDev", "avg", "avgStdDev", "forecast", "forecastStdDev"];
            //     for (var i = 0; i < seriesValues[1].length; i++) {
            //         if (i < seriesValues[0].length) {
            //             arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + ","+ "" + "," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + ","+ "" + ",\n";
            //         }
            //         else if(i < seriesValues[0].length + seriesValues[4].length){
            //             arrayData += seriesValues[1][i] + ","+ "" + ","+ "" + "," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "," + seriesValues[4][i-seriesValues[0].length] + ",\n";
            //         }
            //         else {
            //             arrayData += seriesValues[1][i] + ","+ "" + ","+ "" + "," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + ","+ "" + ",\n";
            //         }
            //     }
            //     this.graphic = new Dygraph("raster-chart",
            //         arrayData,
            //         {
            //             legend: 'always',
            //             ylabel: this.mosaic.yAxis,
            //             errorBars: true,
            //             showRangeSelector: true
            //         }
            //     );
            // }
            // else if(this.mosaic.plotType==3) {
            //     var arrayData = "";
            //     arrayData += "x," + this.mosaic.year + ",AVG\n";
            //     var csvHeader = ["date", "currValue", "currStdDev", "avg", "avgStdDev"];
            //     for (var i = 0; i < seriesValues[1].length; i++) {
            //         if (i < seriesValues[0].length) {
            //             arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + ",," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "\n";
            //         }
            //         else {
            //             arrayData += seriesValues[1][i] + ",,," + seriesValues[2][i] + "," + seriesValues[3][i] / 2 + "\n";
            //         }
            //     }
            //     this.graphic = new Dygraph("raster-chart",
            //         arrayData,
            //         {
            //             legend: 'always',
            //             ylabel: this.mosaic.yAxis,
            //             errorBars: true,
            //             showRangeSelector: true
            //         }
            //     );
            // }
            // else if(this.mosaic.plotType==2) {
            //     var arrayData = "";
            //     arrayData += "x," + this.mosaic.year + ",AVG\n";
            //     var csvHeader = ["date", "currValue", "avg"];
            //     for (var i = 0; i < seriesValues[1].length; i++) {
            //         if (i < seriesValues[0].length) {
            //             arrayData += seriesValues[1][i] + "," + seriesValues[0][i] + "," + seriesValues[2][i] + "\n";
            //         }
            //         else {
            //             arrayData += seriesValues[1][i] + ",," + seriesValues[2][i] + "\n";
            //         }
            //     }
            //     this.graphic = new Dygraph("raster-chart",
            //         arrayData,
            //         {
            //             legend: 'always',
            //             ylabel: this.mosaic.yAxis,
            //             errorBars: false,
            //             showRangeSelector: true
            //         }
            //     );
            // }
            // else{
            //     var arrayData = "";
            //     arrayData += "x," + this.mosaic.year + "\n";
            //     var csvHeader = ["date", "currValue"];
            //     for (var i = 0; i < seriesValues[1].length; i++) {
            //         if (i < seriesValues[0].length) {
            //             arrayData += seriesValues[1][i] + "," + seriesValues[0][i]  + "\n";
            //         }
            //     }
            //     this.graphic = new Dygraph("raster-chart",
            //         arrayData,
            //         {
            //             legend: 'always',
            //             ylabel: this.mosaic.yAxis,
            //             errorBars: false,
            //             showRangeSelector: true
            //         }
            //     );
            //
            // }


            //Download Data:

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
          //  var valueClicked = "Value for " + this.actualTimePosition + " in the selected point is: "+ "<b>" + this.actualValue + "</b>";

           // var chartValueText = dom.byId("chart-value-text");
            var chartValueValue = dom.byId("chart-value-value");
           // var chartSelectedPintText = dom.byId("chart-selected-point-text");
            var chartselectedPointText = dom.byId("chart-selected-point-value");
            chartValueValue.innerHTML = this.actualTimePosition;
            chartselectedPointText.innerHTML = this.actualValue;

            var titleDiv = dom.byId("chart-title");
            var valueDiv = dom.byId("chart-current-value");
            titleDiv.innerHTML = titleSelected;
           // valueDiv.innerHTML = valueClicked;

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