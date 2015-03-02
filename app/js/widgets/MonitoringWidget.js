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
    'dojox/charting/themes/Claro',
    'dojox/charting/plot2d/Lines',
    'dojox/charting/axis2d/Default',
    'dojox/charting/action2d/Tooltip',
    'dojo/domReady!'	
	], function(declare, lang, on, dom, domConstruct, domAttr,
		_WidgetBase, _TemplatedMixin, template, 
        Chart, theme, Lines, AxisDefault, Tooltip){
		
		return declare([_WidgetBase, _TemplatedMixin], {
			templateString: template,
            actualValue: null,
            rasterValues: null,

		constructor: function(args){
            lang.mixin(this, args);
        },

        postCreate: function(){

            this._populateRasterInfo();
        },

        _populateRasterInfo: function(){
            var contenedor = dom.byId("raster-data");
            contenedor.innerHTML = "<span>Value: " + this.actualValue + "</span>"; 

            
            this._createChart();
        },

        _createChart: function(){
            var chart = new Chart("raster-chart");
            chart.setTheme(theme);
            chart.addPlot("default", {
                type: Lines,
                markers: true,
                fontColor: "black",
                labelOffset: -20
            });

            chart.addAxis("x", {
                labels: [
                    {value: 1, text: "Jan"},
                    {value: 2, text: "Jan"},
                    {value: this.rasterValues.length-1, text: "Dec"},
                    {value: this.rasterValues.length, text: "Dec"}
                ]
            });
            chart.addAxis("y", {vertical: true, fixLower: 0, fixUpper: 9000});
            chart.addSeries("ChartName", this.rasterValues);

             var tip = new Tooltip(chart, "default");

            chart.render();
        }
      
	});

});