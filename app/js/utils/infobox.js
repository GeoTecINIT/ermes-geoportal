function infoBoxMaker(svg, layer) {

	
	function svgPos(position, svg, legendXOffset, legendYOffset, itemHeight) {
		var result = {
			x : 0,
			y : 0
		}
        if (typeof (position) == 'string' ) {
			switch (position) {
				case 'left-bottom':
				case 'bottom-left': 
					result.x = legendXOffset;
					result.y = svg.attr('height') - itemHeight - legendYOffset;
					break;

				case 'left-top': 
				case 'top-left': 
					result.x = legendXOffset;
					result.y = legendYOffset/* svg.attr('height')- legendHeight */;
					break;
				

				case 'right-top':
				case 'top-right': 
					result.x = svg.attr('width')- legendXOffset - infoBox.width();
					result.y = legendYOffset;
					break;

				case 'right-bottom':
				case 'bottom-right': 
					result.x = svg.attr('width')- legendXOffset - infoBox.width();
					result.y = svg.attr('height')- itemHeight - legendYOffset;
					break;
	
					
				default :
					result.x = legendXOffset;
					result.y = svg.attr('height') - itemHeight;
					break;
				
			}
		}			
		else {
			if (typeof position == 'object') {
			  result.x = position.x;
			  result.y = position.y;
			}
			else {
				if (typeof position === 'function'){
					obj = position();
					result.x = obj.x /*+ leyendXOffset*/; 
					result.y = obj.y /*+ leyendYOffset*/;
				}
			}
		}
		return result;
	}
	
	var titleHeight = 20;
	
	infoBox.titleHeight = function (value){
		if (!arguments.length)
			return titleHeight;
		// changed = (svg != value)
		titleHeight = value;
		return infoBox;
	}
	
	/**Data is assummed to be a sequence of {type: "", label: , value:}
	 **/
	var data;
	infoBox.data = function (values){
		if (!arguments.length)
			return data;
		// changed = (svg != value)
		data = values;
		return infoBox;
	}

	var title = "InfoBoxTitle";
	
	
	infoBox.boxtitle = function (value){
		if (!arguments.length)
			return (typeof title == 'string')? title: 
				(typeof title== 'function')? title(): title['title'];

		title = value;
		return infoBox;
	}
	
	var position = 'right-bottom';
	
	infoBox.position = function (value){
		if (!arguments.length)
			return position;
		position = value;
		return infoBox;
	}

	infoBox.absposition = function (){
		return calcPosition();
	}
	
	var fill_fn;
	infoBox.itemFill = function (fn){
		if (!arguments.length)
			return fill_fn;
	
		if (typeof (fn) == 'function' ){
		   fill_fn = fn;	
		}
		
		return infoBox;
	}
	
	var legendYOffset = 10;
	 
	infoBox.yoffset  = function (value){
		if (!arguments.length)
			return legendYOffset;
		// changed = (svg != value)
		legendYOffset = value;
		return infoBox;
	}

	infoBox.xoffset  = function (value){
		if (!arguments.length)
			return boxXOffset;
		// changed = (svg != value)
		boxXOffset = value;
		return infoBox;
	}
	
	/*
	infoBox.itemInterSpace = function (value){
		if (!arguments.length)
			return legendYOffset;
		// changed = (svg != value)
		legendYOffset = value;
		return infoBox;
	}
	*/
	
	function getBoxGidSel(){
		var infoBoxId = getBoxGid();
		return 'g#' + infoBoxId;
	}
	
	var infoBoxId = 'infoBox';
	
	infoBox.id = function(value){
		if (!arguments.length)
			return infoBoxId;
		// changed = (svg != value)
		infoBoxId = value;
		return infoBox;
	} 
	
	
	function getBoxGid(){
		return infoBoxId;
	}
	
	infoBox.remove = function(){
		d3.select(getBoxGidSel()).remove();
	}
	
	var parentRectElem;
	infoBox.box = function(){
		return parentRectElem;//d3.select(getBoxGidSel() + " rect");
	}
	
	var bgclass = "infobox";
	infoBox.bgclass = function(value){
		if (!arguments.length)
			return bgclass;
		// changed = (svg != value)
		bgclass = value;
		return infoBox;
	}
	var isfixed = true;
	infoBox.fixed = function(value){
		if (!arguments.length)
			return isfixed;
		// changed = (svg != value)
		isfixed = value;
		return infoBox;
	}
	
	infoBox.datum = function (value){
		infoBox.box().datum(value);
		infoBox.group().datum(value);
		return infoBox;
	}
	
	infoBox.on = function (event, callback){
		infoBox.group().on(event, callback);
		return infoBox;
	}
	
	var infoBoxGroup;
	infoBox.group = function(){
		if (!arguments.length)
			return infoBoxGroup;
	}
	
	/* Box configuration */
	var titleHeightYPadding = 3;
	var itemHeight = 10;
	var boxXOffset = 10;
	var itemXOffset = 3;
	
	
	infoBox.height = function (){
       if (typeof data == 'undefined') data = [];
		var classesNumber = data.length;
		var boxHeight = (classesNumber) * itemHeight
		+ titleHeight + ((classesNumber > 0 )? 5: 0)
		return boxHeight;
	}
	
	infoBox.width = function (){
		return infoBox.box().attr('width');
	}
	

	function calcPosition (){
		return svgPos(position, svg, boxXOffset,
				legendYOffset, infoBox.height());
	}
	
	var lastCalcPosition;
	infoBox.updateBoxPosition= function(){
		
		infoBox.box().attr(
			'x',
			function(d) {
				return svgPos(position, svg, boxXOffset,
						legendYOffset, infoBox.height()).x;
			}).attr(
			'y',
			function(d) {
				return svgPos(position, svg, boxXOffset,
						legendYOffset, infoBox.height()).y;
			})
			
			updateTitlePosition();
		
		lastCalcPosition = {x: infoBox.box().attr('x'), y: infoBox.box().attr(
				'y')};
		//position = lastCalcPosition;
		return lastCalcPosition;		
	}
	
	
	var titleElem;
	
	function updateTitlePosition(){
		if (typeof (titleElem) != 'undefined') {
			// getTitleItemPos(, d, offsetY)
			var titlePos = getTitleItemPos(itemXOffset, {
				parentRect : infoBox.box()
			}, 0);
	
			titleElem.attr('x', function(d) {
				return titlePos.x;
			}).attr('y', function(d) {
				return titlePos.y;
			});
		}
	}

	function getTitleItemPos(offsetX, d, offsetY) {
		return {
			x : (1 * d.parentRect.attr('x')) + offsetX,
			y : (1 * d.parentRect.attr('y')) + offsetY + titleHeight
					- titleHeightYPadding,
			xOffset : offsetX,
			yOffset : offsetY,
			titleH : titleHeight
		}
	}
	
	
	var cornerRadius = {x:5, y:5};
	
	infoBox.cornerRadius = function (value)  {
		 if (!arguments.length) return cornerRadius;
		
		 cornerRadius = value;
		 return infoBox;
	}
	
	var mislegend = false;
	
	infoBox.islegend = function (value)  {
		 if (!arguments.length)
			 return mislegend;
		
		 mislegend  = value;
		 return infoBox;
	}
	
	var mgroupstyle;
	infoBox.groupstyle = function (style){
		if (!arguments.length){
			return mgroupstyle; 
		}
		else {
			mgroupstyle = style;
			return infoBox;
		}
	}
	
	function infoBox() {
		
		var infoBoxId = getBoxGid();
		layer.select(getBoxGidSel()).remove();
		infoBoxGroup = layer.append('g')
		.attr('id', infoBoxId)
		.attr('style', mgroupstyle);
		
		var parent = d3.select(infoBoxGroup.node().parentNode);

		
		var itemSimbolHeight = 8;
		var itemSimbolWidth = itemSimbolHeight;
		
		/* some margin only if there are elements*/;

		/* Full rounded rectangle */
		parentRectElem = infoBoxGroup.append('rect')
						.classed(bgclass, true)
						.attr('width', 20/*only initially*/)
						.attr('height', infoBox.height())
						.attr('rx', infoBox.cornerRadius().x)
						.attr('ry', infoBox.cornerRadius().y);
		
		infoBox.updateBoxPosition();
		
		var dataRanges = [];
		
		for (var i = 0; i < data.length; i++) {
			var dataElem = data[i];
			var obj = {parentRect : parentRectElem};
			for (var prop in dataElem) {
			   	obj[prop] = dataElem[prop];
			}
			dataRanges.push(obj);
		}
		
		function updateBoxWidth(size) {
			var boxWidth = parentRectElem.attr('width');
			if (size > boxWidth) {
				parentRectElem.attr('width', (1 * size) + 5);
			}
			
			infoBox.updateBoxPosition();
		}

		function legendItemAttrs(d, i) {
			return boxItemPos(itemXOffset, 2, i, d, itemHeight);
		}

		function legendTextItemAttrs(d, i) {
			var itemTextYOffset = 0;
			var itemPos = boxItemPos(itemXOffset, itemTextYOffset, i, d,
					itemHeight);

			itemPos.x += itemSimbolWidth + 2;
			itemPos.y += itemHeight - itemTextYOffset;
			return itemPos;
		}

		function boxItemPos(offsetX, offsetY, i, d, itemHeight) {
			return {
				x : (1 * d.parentRect.attr('x')) + offsetX,
				y : (1 * d.parentRect.attr('y') + titleHeight) + offsetY + i
						* itemHeight,
				xOffset : offsetX,
				yOffset : offsetY,
				itemH : itemHeight
			}
		}

		/* Legend symbols */
		
		if (infoBox.islegend()) {
			infoBoxGroup.selectAll('rect.boxItem')
			.data(dataRanges)
			.enter().append(
				'rect')
				.attr("class", function(d) {
				//console.log(d);
				var className = (typeof (d.className) !== 'undefined')? ' boxItem ' + d.className: "";
				return className + " selectable " ;
			}).attr('x', function(d, i) {
				var itemPos = legendItemAttrs(d, i);
				return itemPos.x;
			}).attr('y', function(d, i) {
				var itemPos = legendItemAttrs(d, i);
				return itemPos.y;
			}).attr('width', itemSimbolHeight).attr('height', itemSimbolHeight)
					.attr('rx', 0.5).attr('ry', 0.5)
			.attr('fill', function(d){
				if (typeof (infoBox.itemFill()) == 'function'){
					return infoBox.itemFill()(d, i);
				}
				return null;
			})		
			.on('click', infoBox.legendClick)
			.on('mouseover', infoBox.legendOver)
			.on('mouseenter', infoBox.legendEnter)
			.on('mouseout', infoBox.legendOut);
		}
		
		/* Legend texts */
		infoBoxGroup
				.selectAll('text.boxItemText')
				.data(dataRanges)
				.enter()
				.append('text')
				.classed(infoBox.itemsTextClass(), true)
				.classed('selectable', true)
				.attr('x', function(d, i) {
					var itemPos = legendTextItemAttrs(d, i);
					return itemPos.x;
				})
				.attr('y', function(d, i) {
					var itemPos = legendTextItemAttrs(d, i);
					return itemPos.y;
				})
				.text(
						function(d) {
							var l = "";
							var sep = "";
							if ((typeof (d.label) != 'undefined') && (typeof (d.desc) != 'undefined') ){
								sep = ": " ; 
							} 
							l = ((typeof (d.label) != 'undefined')?d.label : '') + sep + ((typeof (d.desc) != 'undefined')? d.desc : '');
							return  l; 
						})
				.each(
						function(d) {
							itemPos = boxItemPos(itemXOffset
									+ itemSimbolWidth + 2, 0, i, d, itemHeight);
							//console.log(this);
							updateBoxWidth(this.getComputedTextLength()
									+ itemPos.xOffset);
						})
				
				.on('click', infoBox.legendClick)
				.on('mouseover', infoBox.legendOver)
				.on('mouseenter', infoBox.legendEnter)
				.on('mouseout', infoBox.legendOut);

		
		var boxTitle = infoBox.boxtitle();

		// getTitleItemPos(, d, offsetY)
		var titlePos = getTitleItemPos(itemXOffset, {
			parentRect : parentRectElem
		}, 0);

		titleElem = infoBoxGroup.append('text');
		
		titleElem.attr('x', function(d) {
			return titlePos.x;
		}).attr('y', function(d) {
			return titlePos.y;
		}).classed(infoBox.titleTextClass(), true)
		.datum({
			parentRect : parentRectElem
		}).text(function(d) {
			return boxTitle;
		}).each(function(d) {
			//console.log(this);
			updateBoxWidth(this.getComputedTextLength() + titlePos.xOffset);
		});
       return infoBox;
	}
	
	var mtitleTextClass = 'legendTitleText';
    infoBox.titleTextClass = function(titleClass){
    	if (arguments.length == 0){
    		return mtitleTextClass;
    	}
    	else {
    		mtitleTextClass = titleClass;
    		return infoBox;		
    	}
    } 	

    var mitemsTextClass = 'boxItemText';
    infoBox.itemsTextClass= function (itemsClass){
    	if (arguments.length == 0){
    		return mitemsTextClass;
    	}
    	else {
    		mitemsTextClass = itemsClass;
    		return infoBox;		
    	}
    }    

	infoBox.onlegend = function (event, callback) {
		if (!arguments.length)
			return null;
        
		if (typeof (callback) == 'function') {
			switch(event){
				case 'click' :{
					infoBox.legendClick = callback;
					break;
				}
				case 'over' :{
					infoBox.legendOver = callback;
					break;
				}
				case 'enter' :{
					infoBox.legendEnter = callback;				
					break;
				}
				case 'out' :{
					infoBox.legendOut = callback;
					break;
				}
			}
		}
		return infoBox;
	}
	
	infoBox.legendClick = function(d, i) {
		console.log('infoBox click' + d + " index:" + i);
//		cpselector
//		.origclass(d.className)
//		.selclass(d.className + '_sel')
//		.toggleAll();
		return infoBox;
	}

	infoBox.legendOver = function(d, i) {
		console.log('infoBox over' + d + " index:" + i);
		return infoBox;
	}
	
	infoBox.legendEnter = function(d, i) {
		console.log('infoBox enter' + d + " index:" + i);
//		cpselector.origclass(d.className)
//		.selclass(d.className + '_sel')
//		.selectAll();
		
		return infoBox;
	}
	
	infoBox.legendOut = function(d, i) {
		console.log('infoBox out' + d + " index:" + i);
//		cpselector.origclass(d.className)
//		.selclass(d.className + '_sel')
//		.unselectAll();
		return infoBox;
	}
	
	if (typeof pushToZoom != 'undefined') {
		pushToZoom(function (zoom){
			if (!isfixed) {
			   d3.select(getBoxGidSel()).attr('transform',  "translate(" + zoom.translate() + ")");
			}
		});
	}
	
	
	return infoBox;
}
