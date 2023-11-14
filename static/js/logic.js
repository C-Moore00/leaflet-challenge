const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

let quakes = new L.layerGroup();

// create overlay
let overlayMaps = {
    "Earthquakes":quakes
};

// make legend

// get some nice data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

    // add the new layer
    L.geoJson(data, {
        // make features into map circle
        pointToLayer: function(feature, pos) {
            return L.circleMarker(pos);
        },
        style: setStyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(quakes);

    // normal road layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    // topography layer
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // function for setting radius based on magnitude
    // I make the assumption magnitude is not zero as this would be illogical as hell
    function size(magnitude){
        return magnitude*3;
    }

    // function for setting colour based on depth
    // I gotta say, this seems like a very confusing way to represent data on depth
    function depth(depth){
        if (depth > 90){
            return '#FF0202';
        }
        if (depth > 70){
            return '#FF8002';
        }
        if (depth > 50){
            return '#FFBE02';
        }
        if (depth > 30){
            return '#FFFF02';
        }
        if (depth > 10){
            return '#C2FF02';
        }
        if (depth <= 10){
            return '#3FFF02';
        }
    }

    // function for setting style
    function setStyle(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: depth(feature.geometry.coordinates[2]),
            color: '#1F1D1D',
            radius:size(feature.properties.mag),
        }
    }

    // basemaps
    let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
    };

    // make the actual map
    let myMap = L.map("map", {
    center: [40, -95],
    zoom: 2,
    layers: [topo,quakes]
    });

    // finally actually make the map by layering everything
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
    console.log(data);
})
