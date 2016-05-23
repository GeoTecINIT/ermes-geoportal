/**
 * Created by NachoGeotec on 14/04/2016.
 */

var operationalLayerIds = {};
function SetLanguage(lang){
    localStorage.language = lang;

    $.getJSON("js/utils/strings.json", function(data){
        $.each(data, function(index, node) {
            var lang = localStorage.language;
            if(node[lang].html){
                $("#" + node["idNode"]).html(node[lang].html);
            }
            if(node[lang].title){
                $("#" + node["idNode"]).attr("title", node[lang].title);
            }
            if(node[lang].placeholder){
                $("#" + node["idNode"]).attr("placeholder", node[lang].placeholder);
            }
        });
    });

    function updateOperational(element, index, list){
        var nodeName = index.replace(" ", "") + "-button";
        $('#' + nodeName).html(element[lang]);
    }

    _.each(operationalLayerIds, updateOperational);
    
    
}

function SetDropdownLabels(){
    $.getJSON("js/utils/strings.json", function(data) {
        $.each(data, function(index, node) {
            if(node["idNode"] == "monitoring-mosaic-selector-button"){
                $("#monitoring-mosaic-selector-button").html(node[localStorage.language].html);
            }
            //if(node["idNode"] == "comparing-mosaic-selector-button"){
            //    $("#comparing-mosaic-selector-button").html(node[localStorage.language].html);
            //}
        });
    });
}

function SetDateLabel(){
    $.getJSON("js/utils/strings.json", function(data) {
        $.each(data, function(index, node) {
            if(node["idNode"] == "comparing-raster-selector-button"){
                $("#comparing-raster-selector-button").html(node[localStorage.language].html);
            }
        });
    });
}

function SetInfoWindowLanguage(){
    $.getJSON("js/utils/strings.json", function(data) {
        $.each(data, function(index, node) {
            if(node["idNode"] == "info-window-menu-title-local"){
                $("#info-window-menu-title-local").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-menu-title-model"){
                $("#info-window-menu-title-model").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-menu-title-chart"){
                $("#info-window-menu-title-chart").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "show-chart-from-info-window"){
                $("#show-chart-from-info-window").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-show-chart-text"){
                $("#info-window-show-chart-text").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "confirm-edit-product-button"){
                $("#confirm-edit-product-button").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "cancel-editing-modal-window"){
                $("#cancel-editing-modal-window").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "parcel-not-owned-text"){
                $("#parcel-not-owned-text").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "remove-alert-button"){
                $("#remove-alert-button").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "remove-alert-text-h4"){
                $("#remove-alert-text-h4").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-parcel-id-title"){
                $("#info-window-parcel-id-title").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-invalid-parcel-title"){
                $("#info-window-invalid-parcel-title").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-searching-text") {
                $("#info-window-searching-text").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-crop-info-label"){
                $("#info-window-crop-info-label").html(node[localStorage.language].html);
            }

            if(node["idNode"] == "info-window-soils-label"){
                $("#info-window-soils-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-parcelStatus-label"){
                $("#info-window-parcelStatus-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-phenologies-label"){
                $("#info-window-phenologies-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-phatogens-label"){
                $("#info-window-phatogens-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-diseases-label"){
                $("#info-window-diseases-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-weeds-label"){
                $("#info-window-weeds-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-fertilizers-label"){
                $("#info-window-fertilizers-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-agrochemicals-label"){
                $("#info-window-agrochemicals-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-irrigationInfos-label"){
                $("#info-window-irrigationInfos-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-yields-label"){
                $("#info-window-yields-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-observations-label"){
                $("#info-window-observations-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-developmentStage-label"){
                $("#info-window-developmentStage-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-infection-label"){
                $("#info-window-infection-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-abioticRisk-label"){
                $("#info-window-abioticRisk-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-biomass-label"){
                $("#info-window-biomass-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-penicleBiomass-label"){
                $("#info-window-penicleBiomass-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-meteoRadiation-label"){
                $("#info-window-meteoRadiation-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-meteoRainfall-label"){
                $("#info-window-meteoRainfall-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-meteoMaximumHumidity-label"){
                $("#info-window-meteoMaximumHumidity-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-meteoMinimumHumidity-label"){
                $("#info-window-meteoMinimumHumidity-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-meteoMaximumTemperature-label"){
                $("#info-window-meteoMaximumTemperature-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-meteoMinimumTemperature-label"){
                $("#info-window-meteoMinimumTemperature-label").html(node[localStorage.language].html);
            }
            if(node["idNode"] == "info-window-meteoWindSpeed-label"){
                $("#info-window-meteoWindSpeed-label").html(node[localStorage.language].html);
            }
        });
    });
}

function SetOperationalLayerIds(name, langObject){
    operationalLayerIds[name] = langObject;
    //operationalLayerIds.length++;
}

