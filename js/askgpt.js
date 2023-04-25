function mapInitialize(){
    //initialize the map variable as evictionMap and retrun the variable
    let map = L.map('eviction-map').setView([39.952436849966794, -75.16356820883757], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    return map;
}



function showPropertiesOnMap (map) {
    let tileLayer = L.vectorGrid.protobuf('https://storage.googleapis.com/musa509s23_team01_public/tiles/properties/{z}/{x}/{y}.pbf', {
        vectorTileLayerName: 'property_tile_info', // specify the name of the layer with property information
        rendererFactory: L.canvas.tile, // use the canvas-based renderer for better performance
        interactive: true, // enable mouse events on the layer
        getFeatureId: function(feature) { return feature.properties.id; } // use the "id" property as the feature ID for mouse events
      }).addTo(map);
}

function propertyStyle(properties) {
    // get the assessed value of the property from the "assessed_value" property
    var assessedValue = properties.assessed_value;
    
    // determine the color index based on the assessed value and breakpoints
    var colorIndex = colorRamp.length - 1;
    for (var i = 0; i < breakpoints.length; i++) {
      if (assessedValue <= breakpoints[i]) {
        colorIndex = i;
        break;
      }
    }
    
    // return a style object with the chosen color
    return {
      fillColor: colorRamp[colorIndex],
      fillOpacity: 0.5,
      stroke: true,
      color: '#333',
      weight: 1
    };
  }

var evictionMap  = mapInitialize();
let colorRamp = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];
let breakpoints = [0, 50000, 100000, 200000, 500000];

// apply the propertyStyle function to the layer's features
tileLayer.on('mouseover', function(event) {
    event.layer.setStyle(propertyStyle(event.layer.properties));
  });
  tileLayer.on('mouseout', function(event) {
    event.layer.setStyle({ fillColor: null, fillOpacity: 0 });
  });

//show all properties on map based on the url
showPropertiesOnMap(evictionMap);

