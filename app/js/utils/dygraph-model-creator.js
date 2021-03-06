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
    //for(var i =0; i<modelData.length; i++) {
    //    data+= dateFromDay(2015, modelData[i].doy) + "," + modelData[i].value + "\n";
    //    //data.push([modelData[i].value]);
    //}
    var currentDoy = getDOY();
    var currentYear = new Date().getFullYear();

    if(title=="Rice development stage") {
        for (var i = 0; i < modelData.length; i++) {
            if (modelData[i].doy < currentDoy) {
                data += dateFromDay(currentYear, modelData[i].doy) + ",1,1.3,1.6,2,2.5,3,4," + modelData[i].value + ",\n";
            }
            else if (modelData[i].doy - currentDoy < 5) {
                data += dateFromDay(currentYear, modelData[i].doy) + ",1,1.3,1.6,2,2.5,3,4,," + modelData[i].value + "\n";
            }
            else {
                break;
            }
            //data.push([modelData[i].value]);
        }
        if(localStorage.language == 'sp'){
            var plotLabels = ["Doy", "Emersión", "Ahijamiento", "Iniciación de la Panícula", "Floración", "Desarrollo del Grano", "Madurez", "Maximo", "Valor", "Predicción"];
        }
        else {
            var plotLabels = ["Doy", "Emergence", "Tillering", "Panicle Initiation", "Flowering", "Grain Filling", "Maturation", "Maximum", "Value", "Prediction"];
        }
    }
    else if(title == "Above Ground Biomass"){
        for (var i = 0; i < modelData.length; i++) {
            if (modelData[i].doy < currentDoy) {
                data += dateFromDay(currentYear, modelData[i].doy) + "," + modelData[i].value/1000 + ",\n";
            }
            else if (modelData[i].doy - currentDoy < 5) {
                data += dateFromDay(currentYear, modelData[i].doy) + ",," + modelData[i].value/1000 + "\n";
            }
            else {
                break;
            }
            //data.push([modelData[i].value]);
        }
        if(localStorage.language == 'sp'){
            var plotLabels = [ "Doy", "Valor", "Prediccion" ];
        }
        else {
            var plotLabels = [ "Doy", "Value", "Prediction" ];
        }
    }
    else if(title == "Panicle Biomasses"){
        for (var i = 0; i < modelData.length; i++) {
            if (modelData[i].doy < currentDoy) {
                data += dateFromDay(currentYear, modelData[i].doy) + "," + modelData[i].value/1000 + ",\n";
            }
            else if (modelData[i].doy - currentDoy < 5) {
                data += dateFromDay(currentYear, modelData[i].doy) + ",," + modelData[i].value/1000 + "\n";
            }
            else {
                break;
            }
            //data.push([modelData[i].value]);
        }
        if(localStorage.language == 'sp'){
            var plotLabels = [ "Doy", "Valor", "Prediccion" ];
        }
        else {
            var plotLabels = [ "Doy", "Value", "Prediction" ];
        }
    }
    else{
        for (var i = 0; i < modelData.length; i++) {
            if (modelData[i].doy < currentDoy) {
                data += dateFromDay(currentYear, modelData[i].doy) + "," + modelData[i].value + ",\n";
            }
            else if (modelData[i].doy - currentDoy < 5) {
                data += dateFromDay(currentYear, modelData[i].doy) + ",," + modelData[i].value + "\n";
            }
            else {
                break;
            }
            //data.push([modelData[i].value]);
        }
        if(localStorage.language == 'sp'){
            var plotLabels = [ "Doy", "Valor", "Prediccion" ];
        }
        else {
            var plotLabels = [ "Doy", "Value", "Prediction" ];
        }

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
        var g = new Dygraph("model-product-chart-div", data,
            {
                legend: 'follow',
                ylabel: title,
                errorBars: false,
                labels: plotLabels,
                showRangeSelector: true,

                //underlayCallback: function(canvas, area, g) {
                //    var LowCoords = g.toDomCoords(0, 2.25);
                //    var HighCoords = g.toDomCoords(0, 4);
                //
                //    var high = HighCoords[1];
                //    var low = LowCoords[1];
                //
                //    canvas.fillStyle = 'red';
                //    canvas.fillRect(area.x, low, area.w, 2);
                //    canvas.fillStyle = 'blue';
                //    canvas.fillRect(area.x, high, area.w, 2);
                //}
            }
        );

    }
    $(node).append(button);

    $('#' + buttonId).on('click', launchGraph);

}

function getDOY(){var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;

}