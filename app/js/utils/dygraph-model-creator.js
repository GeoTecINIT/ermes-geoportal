/**
 * Created by NachoGeotec on 19/04/2016.
 */
function ShowGraph(node, modelData, title){
    //var data = "Date,Temperature\n" +
    //"2008-05-07,75\n" +
    //"2008-05-08,70\n" +
    //"2008-05-09,80\n";
    function dateFromDay(year, day){
        var date = new Date(year, 0);
        return new Date(date.setDate(day));
    }

    var data = "";
    for(var i =0; i<modelData.length; i++) {
        data+= dateFromDay(2015, modelData[i].doy) + "," + modelData[i].value + "\n";
        //data.push([modelData[i].value]);
    }

    //var data = _.map(modelData, function(value){return value});
    var titleNoSpaces = title.replace(/\s+/g, '');
    var buttonId = "button-show-chart-info-window" + titleNoSpaces;
    var button = '<input id="' + buttonId + '" type="button" class="btn btn-default" value="Show Chart"/>';


    var launchGraph = function() {
        $('#model-product-title-h').html(title);

        $( "#info-window-chart-widget-div" ).draggable({
            handle: $("#info-window-chart-widget-dragger"),
            containment: 'html'
        });

        $("#info-window-chart-widget-div").removeClass("display-none");
        $("#info-window-chart-widget-div").addClass("display-block");


        $('#close-info-window-chart-button').on('click', function(){
            $("#info-window-chart-widget-div").removeClass("display-block");
            $("#info-window-chart-widget-div").addClass("display-none");
        });
        var g = new Dygraph("model-product-chart-div", data, {
            labels: [ "Doy", "Value" ],
            showRangeSelector: true
        });

    }
    $(node).append(button);

    $('#' + buttonId).on('click', launchGraph);

}