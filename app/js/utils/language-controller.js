/**
 * Created by NachoGeotec on 14/04/2016.
 */
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
            if(node["idNode"] == "info-window-searching-text"){
                $("#info-window-searching-text").html(node[localStorage.language].html);
            }
        });
    });
}