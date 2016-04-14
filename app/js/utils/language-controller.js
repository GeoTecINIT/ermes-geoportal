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
        });

    });


    //RECORRER FICHERO STRINGS
        //PARA CADA NOODO
            //PARA EL IDIOMA lang
                //SI HAY HTML: INSERTAR
                //SI HAY TITLE: INSERTAR
}

function SetDropdownLabels(){
    $.getJSON("js/utils/strings.json", function(data) {
        $.each(data, function(index, node) {
            if(node["idNode"] == "monitoring-mosaic-selector-button"){
                $("#monitoring-mosaic-selector-button").html(node[localStorage.language].html);
            }
        });
        //var node = data['monitoring-mosaic-selector-button'];
        //$("#monitoring-mosaic-selector-button").html(node[localStorage.language].html);
    });
}