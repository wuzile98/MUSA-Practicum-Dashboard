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
  let tileLayer = L.vectorGrid.protobuf('https://storage.googleapis.com/wzl_data_lake/tiles/properties/{z}/{x}/{y}.pbf', {
      vectorTileLayerName: 'property_tile_info', // specify the name of the layer with property information
      rendererFactory: L.canvas.tile, // use the canvas-based renderer for better performance
      interactive: true, // enable mouse events on the layer
      getFeatureId: function(feature) { return feature.properties.id; } // use the "id" property as the feature ID for mouse events
    }).addTo(map);
    console.log(tileLayer);
    map.propertiesLayer = tileLayer;
  }

function clearMap(map) {
map.eachLayer(function(layer) {
  if (layer instanceof L.GeoJSON) {
    map.removeLayer(layer);
  }
});
}

function getColorCensus (column) {
  let color = "";
  if (column < 100){
    color = "#f5f2ec";
  } else if (column >= 100 && column < 500 ) {
    color = "#e4dbc4"
  } else if (column >= 500 && column < 1000) {
    color = "#d19b75"
  } else if (column >= 1000 && column < 2000) {
    color = "#a57569"
  } else if (column >= 2000 && column < 3000) {
    color = "#524d60"
  } else {
    color = "#2e2345"
  }
  return color;
}

function styleMapCensus(feature, columns) {
  let color = 'black';
  // let maxNumber = Math.max(...columns);
  // console.log(maxNumber);
  if (feature.properties.hasOwnProperty(columns)) {
    color = getColorCensus(feature.properties[columns]);
  }
  return {
    color: 'black',
    weight: 2,
    fillColor: color,
    fillOpacity: 0.5
  };
}

function showCensusBlocksOnMap (map, column) {
  fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/census_with_counts_01.geojson')
  .then(response => response.json())
  .then(data => {
    let neighborhoods = L.geoJSON(data, {
      style: function(feature) {
        return styleMapCensus(feature, column);
      }
    }).addTo(map);
  });
}

function getColorNeighborhood (column) {
  let color = "";
  if (column < 100){
    color = "#f5f2ec";
  } else if (column >= 100 && column < 500 ) {
    color = "#e4dbc4"
  } else if (column >= 500 && column < 1000) {
    color = "#d19b75"
  } else if (column >= 1000 && column < 2000) {
    color = "#a57569"
  } else if (column >= 2000 && column < 3000) {
    color = "#524d60"
  } else {
    color = "#2e2345"
  }
  return color;
}

function styleMapNeighborhood(feature, columns) {
  let color = 'black';
  // let maxNumber = Math.max(...columns);
  // console.log(maxNumber);
  if (feature.properties.hasOwnProperty(columns)) {
    color = getColorNeighborhood(feature.properties[columns]);
  }
  return {
    color: 'black',
    weight: 2,
    fillColor: color,
    fillOpacity: 0.5
  };
}

function showNeighborhoodsOnMap(map, column) {
fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/neighborhood_with_counts.geojson')
  .then(response => response.json())
  .then(data => {
    let neighborhoods = L.geoJSON(data, {
      style: function(feature) {
        return styleMapNeighborhood(feature, column);
      }
    }).addTo(map);
    
  });
}

function toggleMapFeatures(map) {
  let zoomLevel = map.getZoom();
  map.eachLayer(function (layer) {
    // check if layer is a tile layer (i.e. base map layer)
    if (layer instanceof L.TileLayer) {
      return;
    }
    map.removeLayer(layer);
  });

  if (zoomLevel < 15) {
    // show neighborhoods
    showNeighborhoodsOnMap(map);
  } else if (zoomLevel >= 15 && zoomLevel <= 18) {
    showCensusBlocksOnMap(map);
  } else if (zoomLevel > 18) {
    showPropertiesOnMap(map)
  }
}

export{
  mapInitialize,
  showPropertiesOnMap,
  showNeighborhoodsOnMap,
  clearMap,
  toggleMapFeatures,
  showCensusBlocksOnMap,
};