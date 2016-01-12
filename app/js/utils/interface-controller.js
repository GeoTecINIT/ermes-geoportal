/**
 * Created by NachoGeotec on 20/10/2015.
 */

$(document).on('ui-ready', function(evt) {

    // SETINGS MENU FUNCTION
    $("#settings-icon-div").on('click', function(){
        $("#settings-div-container").toggleClass("settings-div-container-visible settings-div-container-hidden");
        $(this).toggleClass("settings-icon-div-visible settings-icon-div-hidden");
    });

    $("#close-settings-button").on('click', function() {
        $("#settings-div-container").toggleClass("settings-div-container-visible settings-div-container-hidden");
        $("#settings-icon-div").toggleClass("settings-icon-div-visible settings-icon-div-hidden");
    });

    // MONITORING MENU FUNCTION
    $("#monitoring-icon-div").on('click', function(){
        $("#monitoring-div-container").toggleClass("monitoring-div-container-visible monitoring-div-container-hidden");
        $(this).toggleClass("monitoring-icon-div-visible monitoring-icon-div-hidden");
        $("#comparing-icon-div").toggleClass("comparing-icon-div-visible comparing-icon-div-hidden");
        $("#finder-icon-div").toggleClass("finder-icon-div-visible finder-icon-div-hidden");

    });

    $("#close-monitoring-button").on('click', function() {
        $("#monitoring-div-container").toggleClass("monitoring-div-container-visible monitoring-div-container-hidden");
        $("#monitoring-icon-div").toggleClass("monitoring-icon-div-visible monitoring-icon-div-hidden");
        $("#comparing-icon-div").toggleClass("comparing-icon-div-visible comparing-icon-div-hidden");
        $("#finder-icon-div").toggleClass("finder-icon-div-visible finder-icon-div-hidden");

    });

    // COMPARING MENU FUNCTION
    $("#comparing-icon-div").on('click', function(){
        $("#comparing-div-container").toggleClass("comparing-div-container-visible comparing-div-container-hidden");
        $(this).toggleClass("comparing-icon-div-visible comparing-icon-div-hidden");
        $("#monitoring-icon-div").toggleClass("monitoring-icon-div-visible monitoring-icon-div-hidden");
        $("#finder-icon-div").toggleClass("finder-icon-div-visible finder-icon-div-hidden");


    });

    $("#close-comparing-button").on('click', function() {
        $("#comparing-div-container").toggleClass("comparing-div-container-visible comparing-div-container-hidden");
        $("#comparing-icon-div").toggleClass("comparing-icon-div-visible comparing-icon-div-hidden");
        $("#monitoring-icon-div").toggleClass("monitoring-icon-div-visible monitoring-icon-div-hidden");
        $("#finder-icon-div").toggleClass("finder-icon-div-visible finder-icon-div-hidden");

    });

    // FINDER MENU FUNCTION
    $("#finder-icon-div").on('click', function(){
        $("#finder-div-container").toggleClass("finder-div-container-visible finder-div-container-hidden");
        $(this).toggleClass("finder-icon-div-visible finder-icon-div-hidden");
        $("#monitoring-icon-div").toggleClass("monitoring-icon-div-visible monitoring-icon-div-hidden");
        $("#comparing-icon-div").toggleClass("comparing-icon-div-visible comparing-icon-div-hidden");

    });

    $("#close-finder-button").on('click', function() {
        $("#finder-div-container").toggleClass("finder-div-container-visible finder-div-container-hidden");
        $("#finder-icon-div").toggleClass("finder-icon-div-visible finder-icon-div-hidden");
        $("#monitoring-icon-div").toggleClass("monitoring-icon-div-visible monitoring-icon-div-hidden");
        $("#comparing-icon-div").toggleClass("comparing-icon-div-visible comparing-icon-div-hidden");
    });

    // LEGEND WINDOW FUNCTION
    $("#legend-icon-div").on('click', function(){
        $("#legend-div-container").toggleClass("legend-div-container-visible legend-div-container-hidden");
        $(this).toggleClass("legend-icon-div-visible legend-icon-div-hidden");
    });

    $("#close-legend-button").on('click', function() {
        $("#legend-div-container").toggleClass("legend-div-container-visible legend-div-container-hidden");
        $("#legend-icon-div").toggleClass("legend-icon-div-visible legend-icon-div-hidden");
    });





    //Launch Split Window
    $("#split-window-button").on('click', function() {
        window.location.href = "splitmode.html";
    });

});
