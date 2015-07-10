function prepare_url(url, begin_date, end_date){
	if ((typeof begin_date == 'undefined' ||  begin_date == '')
	   && (typeof end_date == 'undefined' || end_date == '')){
		return url;
	}
	else if (typeof begin_date == 'undefined' ||  begin_date == ''){
		return url;
	}
	if (typeof end_date == 'undefined' ||  end_date == ''){
		var formatDate = d3.time.format("%Y-%m-%d");
		end_date  = formatDate(new Date());
	}
	var url_result = url+'?dates='+begin_date+"::" +end_date;
	return url_result;
} 



function callsvc2/*callJSONPService1*/(callback_fn, svcurl) {
	console.log("calling2 jsonp service: " + /*'('+ callback_fn+ ')'+ */svcurl);
	$.ajax({
	    url: svcurl,
	 
	    // the name of the callback parameter, as specified by the YQL service
	    jsonp: 'callback',
	    
	 
	    // tell jQuery we're expecting JSONP
	    dataType: "jsonp",
	 
	    // tell YQL what we want and that we want JSON
//	    data: {
//	        q: "select title,abstract,url from search.news where query=\"cat\"",
//	        format: "json"
//	    },
	 
	    // work with the response
	    success: function( response ) {
	    	 
	         callback_fn(response, svcurl);
	         console.log('reponse: ' + response ); // server response
	    }
	});

}


function callsvc/*callJSONPService1*/(callback_fn, svcurl) {
	console.log("calling0 jsonp service: " + /*'('+ callback_fn+ ')'+ */svcurl);
	$.ajax({
	    url: svcurl,
	 
	    // the name of the callback parameter, as specified by the YQL service
	    jsonp: 'callback',
	    
	 
	    // tell jQuery we're expecting JSONP
	    dataType: "jsonp",
	 
	    // tell YQL what we want and that we want JSON
//	    data: {
//	        q: "select title,abstract,url from search.news where query=\"cat\"",
//	        format: "json"
//	    },
	 
	    // work with the response
	    success: function( response ) {
	    	 
	         callback_fn(response, svcurl);
	         console.log('reponse: ' + response ); // server response
	    }
	});

}

function callsvc1(callback_fn, url_add) {
	// callback = callback_fn;
	$.ajax({
		type : "GET",
		url : url_add,
		context : document.body,
		dataType : 'jsonp',
		// jsonp: 'callback',
		jsonpCallback : 'callback'/* callback_fn */,

		success : callback_fn, /*
								 * function(response) { this.fn(response); //
								 * server response },
								 */

		error : function(e) {
			console.log(e);
		}

	});
}

var smservicesURL = 'http://geo4.dlsi.uji.es/citybenchservices/webresources/v1/socialmedia/';
var urlstats = smservicesURL  + 'statsp';
var url_key_stats = smservicesURL  + 'keywords_statsp';

function baseChart(u){

	
	/*var fullheight = 700;
    var fullwidth = 1200;*/
	var fullheight = 600;
    var fullwidth = 300;

    var margin = {top: 40, right: 100, bottom: 200, left: 100}
	var margin2 = {top: 450, right: 100, bottom: 100, left: 100};

    var maxheight = fullheight;
    var maxwidth = fullwidth;
    
	
	var url = u;
	
	var loadData = function (dataraw){
			
	}
		
	function resize() {
		  /* Update graph using new width and height (code below) */
		/*
		$(window).height();   // returns height of browser viewport
		$(document).height(); // returns height of HTML document
		$(window).width();   // returns width of browser viewport
		$(document).width(); // returns width of HTML document
		*/
		
		var win_width = $(window).width();
		var win_height = $(window).height();

		console.log("resize width: "+ win_width + ' height: ' + win_height);

		if (win_width <= maxwidth){
		   fullwidth = win_width;
		}
		
		if (win_height <= maxheight){
			   fullheight = win_height;
		}
		
		if (typeof loadData.handleResize != 'undefined')
		  loadData.handleResize();
	}
	
	function addResizeEvent(func) {
	    var oldResize = window.onresize;
	    window.onresize = function () {
	        func();
	        if (typeof oldResize === 'function') {
	            oldResize();
	        }
	    };
	}
	
	addResizeEvent(resize); 

	/*var width = fullwidth - margin.left - margin.right;
	var height = fullheight - title_height - margin.top - margin.bottom;
    var height2 = fullheight - title_height - margin2.top - margin2.bottom;
    */
    var title_height = 100;
    
    
    loadData.cheight = function (){
			return loadData.height() - title_height - loadData.margins().top - loadData.margins().bottom;
		
	}

	loadData.cwidth = function (){
			return loadData.width() - loadData.margins().left - loadData.margins().right;
	}

	
	loadData.height = function (h){
		if (!arguments.length)
			return fullheight;
		else {
			fullheight = h;
			return loadData;
		}
	}

	loadData.width = function (w){
		if (!arguments.length)
			return fullwidth;
		else {
		fullwidth = w;
		return loadData;
		}
	}
	
	loadData.margins = function (m){
		if (!arguments.length)
			return margin;
		else {margin = m;
		return loadData;
		}
	}

	loadData.margins2 = function (m){
		if (!arguments.length)
			return margin2;
		else {
			margin2 = m;
			return loadData;
		}
	}
   
	loadData.load = function (after){
		if (typeof mdatasource == 'function'){
			mdatasource(function(data_full) {
				   mdatanew = data_full;
				   var data = data_full[data_prop];
				   if (typeof data_filter_fn == 'function'){
					   data = data_filter_fn(data_full) 
				   }
				   loadData.fn(data);
				   
				   if (typeof after != 'undefined'){
				    	after(loadData);
				   }  
			}, url);		
		}	
		else {
			 var data = mdatasource[data_prop];
			   if (typeof data_filter_fn == 'function'){
				   data = data_filter_fn(mdatasource); 
			   }

			 loadData.fn(data);
			 if (typeof after != 'undefined'){
			    	after(loadData);
			 }
		}
		
	}
	
	
    var data_filter_fn;
	loadData.datafilter = function (filter){
		if (arguments.length == 0){
		    return data_filter_fn;	
		}
		else {
			if (typeof filter == 'function'){
				data_filter_fn = filter;
			}
		}
		
	   return loadData;
  	}

	var data_prop;
	loadData.dataproperty = function(data_property){
		if (arguments.length == 0){
			return data_prop;
		}
		else data_prop = data_property;
		
		return loadData;
	}
	
	var mdatasource;
	loadData.datasource = function (data_or_fn){
		if (arguments.length ==0) {
			return mdatasource;
		}
		else {
			mdatasource = data_or_fn;
			if (typeof mdatasource != 'function'){
				mdatanew = mdatasource;
			}
			return loadData;
		}
	}

	var mdatanew;
	loadData.data = function (){
		return mdatanew;
	}

	return loadData;
}


function pieChart(url){

	    loadData = baseChart();

        var header =     {
				"title": {
					"text": "Crisis",
					"fontSize": 34,
					"font": "garamond"
				},
				"subtitle": {
					"text": "People talking about crisis in twitter",
					"color": "#999999",
					"fontSize": 15,
					"font": "garamond"
				},
				"location": "pie-center",
				"titleSubtitlePadding": 15
			};	    

		  var title;
	      loadData.title = function (mtitle){
				    if (arguments.length >0){
				    	title = mtitle;
				    	header.title.text = title; 
				    	return loadData;
				    }
				    else {
				    	return title;
				    }
			   }			

	    	var config = {
			
			"footer": {
				"text": "* This data is based on data gathered as part of citybench project",
				"color": "#999999",
				"fontSize": 10,
				"font": "open sans",
				"location": "bottom-left"
			},
			"size": {
				"canvasWidth": 590,
				"pieInnerRadius": "89%",
				"pieOuterRadius": "95%"
			},
			"labels": {
				"outer": {
					"format": "label-percentage1",
					"pieDistance": 20
				},
				"inner": {
					"format": "none"
				},
				"mainLabel": {
					"fontSize": 11
				},
				"percentage": {
					"color": "#999999",
					"fontSize": 11,
					"decimalPlaces": 2
				},
				"value": {
					"color": "#cccc43",
					"fontSize": 11
				},
				"lines": {
					"enabled": true,
					"color": "#777777"
				}
			},
			"effects": {
				"pullOutSegmentOnClick": {
					"effect": "linear",
					"speed": 400,
					"size": 8
				}
			},
			"misc": {
				"colors": {
					"segmentStroke": "#000000"
				}
			},
			"callbacks": {}
		};

	    loadData.fn = function (dataraw){
		
			var data = [];
			for(var j =0; j< dataraw.length; j++){
				var key = dataraw[j];
				data.push({label: key.keyword, value: key.total_mentions});
			}
	   
		    config.data = {
		    		"sortOrder": "label-desc",
		 			"content": data,
		 			smallSegmentGrouping: {
					enabled: true,
					value: 1,
					valueType: "percentage",
					label: "Other",
					color: "#cccccc"
		 			}
		     };
		    config.header = header;
		    
	        var pie = new d3pie("pieChart", config);
	   }
	    
	return loadData;

}

	
function linearChart (urlstats, fields, data_prop, div_id, mid){

	    var loadData = baseChart(urlstats);
	
        var id = mid;
        
		var title_height = 100;
		
		var height2 = function (){
			return loadData.height() - title_height - loadData.margins2().top - loadData.margins2().bottom;
		}
		
		var format = d3.time.format("%Y-%m-%d");
	    var formatLabel = d3.time.format("%d-%m-%Y");
		var parseDate = format.parse;

		//x and y axis behavior 
		var x;
		var y;

		//x and y axis behavior on the context 
        var x2;
        var y2;		    

		//color scheme
		var color;
		
		//x Axis for both context chart and full chart 
		var xAxis;
		var xAxis2;

		//y Axis
		var yAxis;
		var yAxis2;
		
		//the full chart
		var linesChart;	    

		//the context chart and it brush
	    var brush; 	  
	    var context;

	    //the functions plotted in lines chart and the context chart
		var line;
		var line2;
        		    
       var full_svg;
       var svg;		


       //infobox (balloon) and the point shown in the full chart 
       var pointInfobox;
       var drawDataPoint;
       
       function updateInfoBox(){
	        if (typeof pointInfobox != 'undefined'){
	        	pointInfobox();
	        	if (typeof drawDataPoint == 'function'){
	        		drawDataPoint();
	        	}
	        }
       }
       
       loadData.handleResize = function(){
    	   loadData.init(true); 
       }
       
       loadData.init = function(resize){
    	
        if (typeof resize == 'undefined') {
			x = d3.time.scale()
			    .range([0, loadData.cwidth()]);
			
			y = d3.scale.linear()
			    .range([loadData.cheight(), 0]);
			
	        x2 = d3.time.scale().range([0, loadData.cwidth()]);
	        
	        y2 = d3.scale.linear().range([height2(), 0]);		    
	
			color = d3.scale.category10();
			
			xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");
			    
			xAxis2 = d3.svg.axis()
			.scale(x2).orient("bottom");    
			
			yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");
	
			yAxis2 = d3.svg.axis()
			    .scale(y2)
			    .ticks(loadData.cheight()/100)
			    .orient("left");
			    
		   //var linesChart;	    
		   line = d3.svg.line()
			    .interpolate("basis")
			    .x(function(d) {
			       //console.log(formatLabel(d.date));
			       return x(d.date); })
			    .y(function(d) { return y(d.val); });	
	
		  line2 = d3.svg.line()
			    .interpolate("basis")
			    .x(function(d) { return x2(d.date); })
			    .y(function(d) { return y2(d.val); });	
        }
        else  {
        	//update ranges based on their size
        	x.range([0, loadData.cwidth()]);
		
			y.range([loadData.cheight(), 0]);
			
	        x2.range([0, loadData.cwidth()]);
	        
	        y2.range([height2(), 0]);	
	        
	        var ax = svg.select(".x.axis");
	        ax.call(xAxis);

	        var cax = context.select(".x.axis");
	        cax.call(xAxis2);
	        
	        linesChart.selectAll(".line").attr("d", function(d) { return line(d.values); });
	        context.selectAll(".line").attr("d", function(d) { return line2(d.values); });
	        
	        
	        context.selectAll(".x.brush")
	        .call(brush)
		    .selectAll("rect")
		      .attr("y", -6)
		      .attr("height", height2() + 7);
	        
	        xAxis.ticks(loadData.cwidth()/80);
	        xAxis2.ticks(loadData.cwidth()/80);

	        updateInfoBox();
	        
        }

	 //d3.select("#"+ id).remove();
		 if (typeof resize == 'undefined') {
		     full_svg = d3.select("#"+ div_id).append("svg").attr("id",id);
		
		     full_svg.append("defs").append("clipPath")
		     .attr("id", "clip")
		     .append("rect")
		     .attr("width",  loadData.cwidth())
		     .attr("height", loadData.cheight() + 40);
		 }
		 else {
	         full_svg.select('#clip rect')
			 .attr("width", /*loadData.cwidth()*/ loadData.cwidth()/*1200*/)
		     .attr("height", loadData.cheight());
		 }
		 
		 if (typeof resize == 'undefined') {
		 svg = full_svg
			    .attr("width", loadData.width())
			    .attr("height",  loadData.height())
			    .append("g").attr('id', 'chart_body')
			    .attr("transform", "translate(" + loadData.margins().left + "," + (title_height + loadData.margins().top) + ")");
		 }
		 else {
			 full_svg.select('#chart_body')
			 .attr("transform", "translate(" + loadData.margins().left + "," + (title_height + loadData.margins().top) + ")");
		 }
	     
     
		 /* debug utility
		 var svg_rect = full_svg.append('rect')
		 .attr("width",full_svg.attr("width"))
		 .attr("height",full_svg.attr("height"))
		 .attr('style', 'fill:none;stroke-width:3;stroke:rgb(0,0,0)');
		 */
		 
		 if (typeof resize == 'undefined') {
		     brush = d3.svg.brush()
		     .x(x2)
		     .on("brush", 
		   	  function (){ 
		    	      //change the dmain on x
			          x.domain(brush.empty() ? x2.domain() : brush.extent());
			          var ax = svg.select(".x.axis");
			          ax.call(xAxis);
		
			          linesChart.selectAll(".line").attr("d", function(d) { return line(d.values); });
			          updateInfoBox();
			         }
		     );	
		 }
     
    }

		loadData.fn = function (data) {

		    color.domain(fields);
		    data.forEach(function(d) {
		      d.date = parseDate(d.time);
		    });
		
			  var tweet_stats = color.domain().map(function(name) {
			    return {
			      name: name,
			      values: data.map(function(d) {
			        return {date: d.date, val: d[name]/*d['daily_geolocalized']*100*/};
			      })
			    };
			  });
		
			  x.domain(d3.extent(data, function(d) { return d.date; }));
		
			  y.domain([
			    d3.min(tweet_stats, function(c) { return d3.min(c.values, function(v) { return v.val; }); }),
			    d3.max(tweet_stats, function(c) { return d3.max(c.values, function(v) { return v.val; }); })
			  ]);
		
			  x2.domain(x.domain());
              y2.domain(y.domain());
	 
              
              var titleData = [];
              titleData.push(loadData.title());
              var titleGroup = full_svg.selectAll(".title")
			    .data(titleData)
			    .enter().append("g")
			    .attr('id', 'title_group')
			    .attr("transform", "translate(" + loadData.margins().left + "," + (loadData.margins().top) + ")");


               var infoboxTitle = infoBoxMaker(full_svg,  titleGroup);
				
			   var dataarr = [];

			    dataarr.push({
				label: loadData.subtitle()});
				
				infoboxTitle
				.position("top-left")
				.yoffset(10)
				.data(dataarr)
				.bgclass('infoboxNoBorder')
				.itemsTextClass('chart_subtitle')
				.titleTextClass('chart_title')
				.boxtitle(loadData.title());
				infoboxTitle();

              
			  linesChart = svg.selectAll(".indicator")
			    .data(tweet_stats)
			    .enter().append("g")
			    .attr("class", "indicator");
		
			   var dataRanges = [];
			    
			  linesChart.append("path")
			      .attr("class", "line")
			      .attr("d", function(d) { return line(d.values); })
			      .style("stroke", function(d) { return color(d.name); })
			      .on('mouseover', function (d, i){
			    	   var xy = d3.mouse(linesChart.node());
			    	   var xpos = xy[0];
			    	   var ypos = xy[1];
			    	   
			    	   var teewts_count =  y.invert(ypos);
			    	   var date =  x.invert(xpos);

			    	    pointInfobox = infoBoxMaker(full_svg,linesChart);
						
						var dataarr = [];

						dataarr.push({
							label: "tweets", 
							desc: d3.round(teewts_count),
							infoValue: teewts_count});
						
						dataarr.push({
								label: "date", 
								desc: formatLabel(date),
								infoValue: date});
						pointInfobox
						.position(/*{x: xpos, y: ypos}*/ function (){
							return {y: y(teewts_count), x: x(date)};
						})
						.id('pointInfoBox')
						.data(dataarr)
						.itemsTextClass('boxItemText1')
						.titleTextClass('legendTitleText1')
						.boxtitle(d.name)
						.groupstyle('clip-path: url(#clip);');
						
						pointInfobox();

						//set the point
						drawDataPoint = function (){
						console.log('drawing the data point');	
						linesChart.selectAll('#datapoint').remove();
							linesChart.append('circle').attr('r', 2)
							.attr('id', 'datapoint')
							.attr('cx', function (){ return x(date)})
							.attr('cy', function (){return  y(teewts_count)})
							.attr('stroke',color(d.name))
							.attr('fill',color(d.name))
							.classed('clipped', true);
						};
						drawDataPoint();
						
			      });
			  
			     tweet_stats.forEach(function (d){
					    	dataRanges.push({
								className : d.name,
								extent : [ -1, -1 ],
								label: d.name,
								name: d.name
							}); 
			      });
		
			    //legend 
			    var legendTitle = "Lines";
				var infoBoxLegend = infoBoxMaker(full_svg, svg);
				infoBoxLegend
			    .id('chart_legend')
			    .position("left-top")
			    .boxtitle(legendTitle)
			    .data(dataRanges)
			    .islegend(true)
			    .xoffset(20)
			    .itemFill(function (d, i){
			    	return color(d.name);
			    });
			    /*.onlegend('enter', legendEnter)
			    .onlegend('out', legendOut)
			    .onlegend('over', legendOver)
			    .onlegend('click', legendClick);*/
			    
			    infoBoxLegend();

			  //chart axis    
              svg.append("g")
              .attr("class", "x axis")
			      .attr("transform", "translate(0," + loadData.cheight() + ")")
			      .call(xAxis);
		
			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text("number of tweets");

			  
			    //this is another chart used for reference of the whole data     
				context = full_svg.append("g")
				    .attr("class", "context")
				    .attr('id', 'chart_context')
				    .attr("transform", "translate(" + loadData.margins2().left + "," + (loadData.margins2().top + title_height) + ")");
				
				    
				 context.selectAll("path")
				      .data(tweet_stats)
				      .enter().append("path")
				      .attr("class", "line")
				      .attr("d", function(d) { return line2(d.values); })
				      .style("stroke", function(d) { return color(d.name); });
				
				  context.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height2() + ")")
			      .call(xAxis2);
	
			      context.append("g")
			      .attr("class", "y axis")
			      .call(yAxis2);
			    	  
				  context.append("g")
						      .attr("class", "x brush")
						      .call(brush)
						      .selectAll("rect")
						      .attr("y", -6)
						      .attr("height", height2() + 7);
				
		}

		var ctitle = "";
		loadData.title  = function(mtitle){
			if (arguments.length == 0){
				return ctitle;
			}
			else ctitle = mtitle;
			
			return loadData;
		}
		
		var csubtitle = "";
		loadData.subtitle  = function(mtitle){
			if (arguments.length == 0){
				return csubtitle;
			}
			else csubtitle = mtitle;
			
			return loadData;
		}
	
		loadData.init();
		
		return loadData;
}

d3.select("#go").on("click", function (){
	var fields = ['daily_terms_geolocalized', 'daily_geolocalized'];
	var data_prop= 'dailyData';
		
	var txtdateEnd = $("#dateend").val();
	var txtdateStart = $("#datestart").val();

	//console.log(txtdateEnd);
	//console.log(txtdateStart);
	
	var urlstats1 = prepare_url(urlstats, txtdateStart, txtdateEnd);
	var linear = linearChart(urlstats1, fields, data_prop, "tweets_div", 'chart1')
	                    .dataproperty(data_prop)
						.datasource(callsvc)
						.title("Geolocalized Tweets")
						.subtitle("Geolocalized tweets containing search terms or not.")
						.load(function (obj){
							fields = ['daily_total_tweets', 'daily_no_term_tweets'];
							data_prop= 'dailyData';
								
							var urlstats1 = prepare_url(urlstats, txtdateStart, txtdateEnd);
							//var urlstats1 = urlstats+'?dates=2014-04-05::2014-04-15'
							linearChart(urlstats1, fields, data_prop, "tweets_div", 'chart2')
							.dataproperty(data_prop)
							.datasource(obj.data())
							.title("Daily Tweets")
						    .subtitle("Daily tweets not containing (crisis or unemployment) search terms.")
							.load();
							
						});
						
						

 var fields = ['dataSerie1', 'dataSerie2'];
  var sampledata = { data: [{'dataSerie1': 0.5, 'dataSerie2': 0.8, time: '2011-05-16'}, {'dataSerie1': 0.6, 'dataSerie2': 0.9, time: '2011-06-16'}, {'dataSerie1': 1.0, 'dataSerie2': 0.9, time: '2011-07-16'}] };

  var linear = linearChart(null, fields, data_prop, "sample_div", 'chart2')
    .dataproperty('data')
    .datasource(sampledata)
    .title("A title")
    .subtitle("A subtitle.")
    .load();

});


function barchart(url){

	var margin = {top: 20, right: 20, bottom: 80, left: 80},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "");
	
	loadData = function (data){
	
		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
				  x.domain(data.map(function(d) { return d.keyword; }));
				  y.domain([0, d3.max(data, function(d) { return d.total_mentions; })]);
				  
				  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis)
			      .selectAll("text")
				   .attr("y", 0)
				   .attr("x", 9)
				   .attr("dy", ".35em")
				   .attr("transform", "rotate(90)")
				   .style("text-anchor", "start");
			
				  svg.append("g")
				      .attr("class", "y axis")
				      .call(yAxis)
				    .append("text")
				      .attr("transform", "rotate(-90)")
				      .attr("y", 6)
				      .attr("dy", ".71em")
				      .style("text-anchor", "end")
				      .text("Total Mentions");
				
				  svg.selectAll(".bar")
				      .data(data)
				    .enter().append("rect")
				      .attr("class", "bar")
				      .attr("x", function(d) { return x(d.keyword); })
				      .attr("width", x.rangeBand())
				      .attr("y", function(d) { return y(d.total_mentions); })
				      .attr("height", function(d) { return height - y(d.total_mentions); });
	    }
		
		loadData.load = function (after){
			if (typeof mdatasource == 'function'){
				mdatasource(function(data_full) {
					   mdatanew = data_full;
					   var datalist = data_full[data_prop];
					    loadData(datalist);
					    if (typeof after != 'undefined'){
					    	after(loadData);
					    }  
					    
				}, url);		
			}	
			else {
				 var data = mdatasource[data_prop];
				 loadData(data);
				 if (typeof after != 'undefined'){
				    	after(loadData);
				 }
			}
			
		}
		
	
		var data_prop;
		loadData.dataproperty = function(data_property){
			if (arguments.length == 0){
				return data_prop;
			}
			else data_prop = data_property;
			
			return loadData;
		}
		
		var mdatasource;
		loadData.datasource = function (data_or_fn){
			if (arguments.length ==0) {
				return mdatasource;
			}
			else {
				mdatasource = data_or_fn;
				if (typeof mdatasource != 'function'){
					mdatanew = mdatasource;
				}
				return loadData;
			}
		}
	
		var mdatanew;
		loadData.data = function (){
			return mdatanew;
		}
		
		return loadData;
	}

   
/*   barchart(url_key_stats).dataproperty('keywords')
   .datasource(callsvc).load(function (obj){
	   
       //ECONOMY
       pieChart(url_key_stats)
	   .dataproperty('keywords')
	   .title("CRISIS")
	   .datafilter(function(data){
		  var rs = [];
	      data.keywords.forEach(function(d) {
			     if (d.category == "ECONOMY") {
			    	 rs.push(d);
			     }
			  });	        

			  return rs;
	   })
	   .datasource(obj.data())
	   .load();
	   
	   //UNEMPLOYMENT
	   	pieChart(url_key_stats)
	   .dataproperty('keywords')
	   .title("UNEMPLOYMENT")
	   .datafilter(function(data){
		  var rs = [];
	      data.keywords.forEach(function(d) {
			     if (d.category == "UNEMPLOYMENT") {
			    	 rs.push(d);
			     }
			  });	        

			  return rs;
	   })
	   .datasource(obj.data())
	   .load();

   });*/

   
 function bubblechart(div_id, url){
	
	 var loadData = baseChart(url);
	 var diameter = 400;
	 var format = d3.format("d");
	 var color = d3.scale.category20c();
	 var node;
	 
	var bubble = d3.layout.pack()
	    .sort(function comparator(a, b) {
	    	  return b.total_mentions - a.total_mentions;
	    })
	    .size([diameter, diameter])
	    .padding(1.5)
	    .value(function (d){
	    	return d.total_mentions;
	    });

	var svg = d3.select("#"+div_id).append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	    .attr("class", "bubble");

	loadData.handleResize = function(){
	   console.log('handling resizing in bubbles');	
	   loadData.update();
    }
	
	loadData.update = function (){
		var w = loadData.cwidth();
	 	var h = loadData.cheight();
	 	diameter = Math.min(w, h);
		bubble.size([diameter, diameter]);
		   
		//var svg = d3.select("#"+div_id + ' svg');
		svg.attr("width", diameter)
	    .attr("height", diameter);
		
		//var circles = d3.selectAll("#"+div_id + ' svg circle');
		if (typeof mdata!= 'undefined')
		   loadData.fn(mdata);
	}
	
	var mdata;
	loadData.fn = function(data){
	   mdata = data;
	   svg.selectAll(".node").remove();

	   var datag = svg.selectAll(".node")
	      .data(bubble.nodes({children: data}));

		node = datag.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		  node.append("title")
		      .text(function(d) { return  d.keyword + ": " + format(d.total_mentions) + ' mentions'; });
	
		  node.append("circle")
		      .attr("r", function(d) { return (!d.children)? d.r: 0;})
		      .style("fill", function(d) { return color(d.keyword); })
		      .on('mouseenter', function(d){
		    	d3.select(this).attr('r', d3.select(this).attr('r')*2);  
		      })
		      .on('mouseout', function(d){
		    	d3.select(this).attr('r', d3.select(this).attr('r')/2);  
		      });

	  node.append("text")
	      .attr("dy", ".3em")
	      .style("text-anchor", "middle")
	      .text(function(d) { 
	    	  if (!d.children) {
	    	     return d.keyword.substring(0, d.r / 2); 
	    	  }
	          else return "Keywords";} 
	      );

	  //d3.select(self.frameElement).style("height", diameter + "px");
    };
    return loadData;
 }
 
 bubblechart('bubble_div', url_key_stats)
 .dataproperty('keywords')
 .datasource(callsvc).load();
 

/* function showKeywordsMaps(div_id){
		
	    //loadData = baseChart();
	 
	    var svg = d3.select("#"+div_id).append("svg")
	    .attr("width", 400 )
	    .attr("height", 400);
	    
	    // show luz
		luzMap = new mapchart(svg);
		luzMap.gid("luz")
		.classes("luz shadowed")
		.labelpos('center');

		function loadMaps (){	
			console.log("loading maps..")
			callsvc2(function(response) {
				//luzData = response;
				//setLuzData(response);
				console.log("loading maps information..")
				luzMap.draw(response);
			}, urlluz);
		}
		
		loadMaps();
 }*/

 //showKeywordsMaps('map_div');
 