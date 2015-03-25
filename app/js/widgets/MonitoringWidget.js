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
    'dojox/charting/plot2d/StackedLines',
    'dojox/charting/axis2d/Default',
    'dojox/charting/action2d/Tooltip',
    'dojo/domReady!'	
	], function(declare, lang, on, dom, domConstruct, domAttr,
		_WidgetBase, _TemplatedMixin, template, 
        Chart, theme, Lines, StackedLines, AxisDefault, Tooltip){
		
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
            var contenedor = dom.byId("raster-data");
            contenedor.innerHTML = "<span>Value: " + this.actualValue + "</span>"; 
            this._createChart();
        },

        _createChart: function(){
            var chart = new Chart("raster-chart");
            chart.setTheme(theme);
            chart.addSeries("Serie 1", 
                            [{x: this.actualTimePosition, y: this.actualValue}]);

            chart.addPlot("default", {
                min: 0,
                type: StackedLines,
                tension: "S",
                markers: true,
                fontColor: "black",
                labelOffset: -20
            });

            chart.addAxis("x", {
                min: 1,
                title: "Timeline",
                titleOrientation: "away"
            });

            chart.addAxis("y", {
                vertical: true, 
                fixLower: 0, 
                fixUpper: 9000,
                title: this.mosaicName,
                titleOrientation: "axis"});
            chart.addSeries("Serie 2", this.rasterValues);

            var tip = new Tooltip(chart, "default");
            chart.render();
        },

        _closeChart: function(){
            this.destroy();
        }
      
	});

});