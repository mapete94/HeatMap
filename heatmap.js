/**
 * Created by root on 5/16/16.
 */
var url ="http://michaelandrewpeterson.com/coordinates/";
var body = {};
var latLng = [];
var heat = null;
// instantiate a map to be centered on raleigh
var mymap = L.map('mapid').setView([35.77, -78.63], 13);
//citing source of map data etc
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

// function called when map movement ends
function onMoveEnd(e){
    var bounds = mymap.getBounds();
    var queryString = "?bbox="+bounds['_southWest']['lng']+","+bounds['_southWest']['lat']+","+bounds['_northEast']['lng']+","+bounds['_northEast']['lat'];
    latLng=[];
    $.getJSON(url+queryString, body, drawHeatMap);
}
//function for adding points to heatlayer and drawing it
function drawHeatMap(result) {
    //add all results to an array to be passed to heat layer
    result['results'].forEach(function(entry){
        latLng.push([entry['latitude'], entry['longitude'], entry['count']]);
    });
    
    //if more pages of results get those
    if (result['next'] != null){
        $.getJSON(result['next'], body, drawHeatMap);
    }
        
    //if heat map is instantiated redraw with new coordinates    
    else if (heat != null)
    {
        heat.setLatLngs(latLng);
    }
    //if heat map is not made yet draw it with lat lng recieved    
    else heat= L.heatLayer(latLng,{max: 5000, maxZoom: 0}).addTo(mymap);

}

mymap.on('moveend',onMoveEnd);

// added bounds so user can't scroll to lat lng over 180 etc
//thhose don't exist in db
var southWest = L.latLng(-180, -250),
    northEast = L.latLng(180, 250),
    bounds = L.latLngBounds(southWest, northEast);
mymap.setMaxBounds(bounds);