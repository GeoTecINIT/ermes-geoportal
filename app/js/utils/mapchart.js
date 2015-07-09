function mapchart(svg) {

	this.svg = svg;
	this.classes = ""; // default height
	this.gid = "";
	this.labelposition = "";
	this.showlabels = true;

	this.disabled = false;

	
	this.fn = function() {
		var result_fn = this.draw;
		return result_fn;
	}

	this.draw = function(results) {

		function feature(geojson) {
			this.type = "Feature";
			this.geometry = geojson;
			return this;
		}

		var data1 = results.places;
		var outobj = this;

		d3.select(svg.append("g").attr("id", this.gid).node())
		       // .attr('class',"zoomable")
		       .classed("zoomable", true)  
		       .selectAll("path").data(data1, function(d) {
			return d.id
		}).enter().append("path").attr("id", function(d) {
			return d.id;
		})
		.attr("class", this.classes /* "luz shadowed" */)
		.attr("d",
				function(d) {
					return path(new feature(d.geojson));
				});

		if (outobj.showlabels){
		d3.select(
					svg.append("g").attr('class', 'zoomable').attr("id",
								'labels_' + outobj.gid).node())
				.selectAll("text")
				.data(data1)
				.enter()
				.append("text")
				// .attr("class", "citylabel")
				.classed("citylabel", true)
				.attr("id", function(d){
					return "label"+d.id;
				})
				.attr(
						"transform",
						function(d) {
							if (outobj.showlabels) {
								var feat = new feature(d.geojson);
								bounds = path.bounds(feat);

								switch (outobj.labelposition) {
								case 'top': {
									return "translate("
											+ ((bounds[0][0] + bounds[1][0]) / 2)
											+ "," + bounds[0][1] + ")";
								}
								case 'center': {
									return "translate(" + path.centroid(feat)
											+ ")"
								}
								case 'left': {
									return "translate("
											+ (bounds[0][0])
											+ ","
											+ ((bounds[1][1] + bounds[0][1]) / 2)
											+ ")";
								}
								}
							}

						}).text(function(d) {
					return d.name + " (" + d.id + ")"
				}).on("click", function(e) {
					hu(d3.select("g path#" + e.id), 'text');
				});
		}
		svg.call(zoom);
		updateVector();

		// vector = d3.selectAll("svg g");
		vector.selectAll("g#" + this.gid + " path").on("mouseover",
				function(e) {
					// d3.select(this).transition().attr("fill", "#EF7550");
					// highlight(d3.select(this), 'path');
					// d3.select(this).transition().
					// select(this).datum()
				}).on('mouseout', function(e) {
		}).on('click', function(e) {
			// d3.select(this).attr("class", "shadowed")
			hu(d3.select(this), 'path');

		});

		return this;

	}

	this.classes = function(value) {
		if (!arguments.length)
			return this.classes;
		this.classes = value;
		return this;
	};

	this.gid = function(value) {
		if (!arguments.length)
			return this.gid;
		this.gid = value;
		return this;
	};

	this.labelpos = function(value) {
		if (!arguments.length)
			return this.labelposition;
		this.labelposition = value;
		return this;
	};

	this.showlabels = function(value) {
		if (!arguments.length)
			return this.showlabels;
		this.showlabels = value;
		return this;
	};

	this.dimmMap = function(value) {
		d3.select("g#" + this.gid).attr('opacity', value);

		d3.select("g#labels_" + this.gid).attr('opacity', value);

	}

	this.enabled = function(value) {
		if (!arguments.length)
			return !this.disabled;

		if (!value) {
			this.dimmMap(0.1);
			disabled = true;
		} else {
			disabled = false;
			this.dimmMap(1);
		}
	}

	this.remove = function() {
		d3.select("g#" + this.gid).remove();
		d3.select("g#labels_" + this.gid).remove();
	}

	return this;
}

