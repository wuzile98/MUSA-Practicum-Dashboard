function mapInitialize(){
  //initialize the map variable as evictionMap and retrun the variable
  
  let map = L.map('eviction-map').setView([39.952436849966794, -75.16356820883757], 13);

      const mapboxAccount = 'mapbox';
      const mapboxStyle = 'light-v10';
      const mapboxToken = 'pk.eyJ1IjoieWVzZW5pYW8iLCJhIjoiY2tlZjAyM3p5MDNnMjJycW85bmpjenFkOCJ9.TDYe7XRNP8CnAto0kLA5zA';

      L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`, {
      maxZoom: 19,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      }).addTo(map);

  return map;
  }


function showPropertiesOnMap(map) {
  // Load the vector tile layer
  let tileLayer = L.vectorGrid.protobuf(
    "https://storage.googleapis.com/wzl_data_lake/tiles_01/{z}/{x}/{y}.pbf",
    {
      rendererFactory: L.canvas.tile,
      interactive: true,

      vectorTileLayerStyles: {
        parcel_with_counts_trim: function(properties, zoom) {
          var count = properties.eviction_count_total;
          var fillColor = 'red';
          if (count == 0) {fillColor = "#f5f2ec";}
          else if (count >0 && count <= 10) {fillColor = '#e4dbc4';}
          else if (count > 10 && count <= 50) {fillColor = '#d19b75';}
          else if (count > 50 && count <= 150) {fillColor = '#a57569';}
          else if (count > 150 && count <= 500) {fillColor = '#524d60';}
          else {fillColor = '#2e2345';}
          return {
              weight: 2,
              fillColor: fillColor,
              color: 'black',
              fill: true,
              opacity: 0.8,
              fillOpacity: 0.8,
              dashArray: '3'
              
          };
        },
      },

      getFeatureId: function(feature){
        return feature.properties.parcel_number;
      }

    }
  ).addTo(map);

  // Store the layer in the map object
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
  } else if (column >= 1000 && column < 1500) {
    color = "#a57569"
  } else if (column >= 1500 && column < 2000) {
    color = "#524d60"
  } else {
    color = "#2e2345"
  }
  return color;
}


function styleMapCensus(feature){
  return {
    fillColor: getColorCensus(feature.properties.eviction_count_total),
    weight: 2,
    color: 'black',
    opacity: 1,
    dashArray: '3',
    fillOpacity: 0.7
  }
}

function showCensusBlocksOnMap (map, column) {
  fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/census_with_counts_01.geojson')
  .then(response => response.json())
  .then(data => {
    let census_tract = L.geoJSON(data, {
      style: function(feature) {
        return styleMapCensus(feature, column);
      },
      onEachFeature: function(feature, layer) {
        // Create an array of strings representing the keys and values for each property in the feature's properties object
        var props = [
          'GEOID: ' + feature.properties.GEOID,
          'eviction_count_total: ' +feature.properties.eviction_count_total,
        ];

        // Create a popup content string that includes the array of properties
        var popupContent = '<strong>Census_Tract:</strong><br>' + props.join('<br>');

        // Bind the popup to the layer and bind it to the click event
        layer.bindPopup(popupContent);
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

function styleMapNeighborhood(feature){
  return {
    fillColor: getColorNeighborhood(feature.properties.eviction_count_total),
    weight: 2,
    color: 'black',
    opacity: 1,
    dashArray: '3',
    fillOpacity: 0.7
  }
}


function showNeighborhoodsOnMap(map, column) {
fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/neighborhood_with_counts.geojson')
  .then(response => response.json())
  .then(data => {
    let neighborhoods = L.geoJSON(data, {
      style: function(feature) {
        return styleMapNeighborhood(feature);
      },
      onEachFeature: function(feature, layer) {
        // Create an array of strings representing the keys and values for each property in the feature's properties object
        var props = [
          'name: ' + feature.properties.name,
          'eviction_count_total: ' +feature.properties.eviction_count_total,
        ];

        // Create a popup content string that includes the array of properties
        var popupContent = '<strong>Neighborhood:</strong><br>' + props.join('<br>');

        // Bind the popup to the layer and bind it to the click event
        layer.bindPopup(popupContent);
      }
    }).addTo(map);
    return neighborhoods;
    
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

  if (zoomLevel < 14) {
    // show neighborhoods
    showNeighborhoodsOnMap(map);
  } else if (zoomLevel >= 14 && zoomLevel <= 16) {
    showCensusBlocksOnMap(map);
  } else if (zoomLevel > 16) {
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