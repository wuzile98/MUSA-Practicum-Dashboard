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


// function showPropertiesOnMap(map) {
//   // Load the vector tile layer
//   let tileLayer = L.vectorGrid.protobuf('https://storage.googleapis.com/wzl_data_lake/tiles/properties/{z}/{x}/{y}.pbf', {
//     vectorTileLayerName: 'property_tile_info',
//     rendererFactory: L.canvas.tile,
//     interactive: true,
//     getFeatureId: function(feature) { return feature.properties.id; }
//   }).addTo(map);

//   // Store the layer in the map object
//   map.propertiesLayer = tileLayer;
// }


function showPropertiesOnMap(map) {
  // Load the vector tile layer
  let tileLayer = L.vectorGrid.protobuf(
    "https://storage.googleapis.com/wzl_data_lake/tiles/properties/{z}/{x}/{y}.pbf",
    {
      vectorTileLayerName: "property_tile_info",
      rendererFactory: L.canvas.tile,
      interactive: true,
      getFeatureId: function (feature) {
        return feature.properties.id;
      },
    }
  ).addTo(map);

  // Store the layer in the map object
  map.propertiesLayer = tileLayer;

  // Search for a property by its address
  function searchPropertyByAddress(address) {
    let foundProperty = null;
    let layers = tileLayer.getLayers();
    layers.forEach(function(layer) {
      let layerAddress = layer.feature.properties.ADDRESS;
      if (layerAddress && layerAddress.toUpperCase() === address.toUpperCase()) {
        foundProperty = layer.feature;
        return;
      }
    });
    return foundProperty;
  }

  // Show a popup with property information
  function showPropertyInfoPopup(feature) {
    let popupContent =
      "<b>" +
      feature.properties.ADDRESS +
      "</b><br>" +
      "Owner: " +
      feature.properties.OWNER +
      "<br>" +
      "Assessed Value: $" +
      feature.properties.AV_TOTAL.toLocaleString() +
      "<br>";
    L.popup()
      .setLatLng([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
      ])
      .setContent(popupContent)
      .openOn(map);
  }

  // Add event listener to the search button
  let searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", function () {
    let searchInput = document.getElementById("search-input");
    let address = searchInput.value.trim();
    let foundProperty = searchPropertyByAddress(address);
    if (foundProperty) {
      // Pan and zoom to the property location
      let latlng = L.latLng(
        foundProperty.geometry.coordinates[1],
        foundProperty.geometry.coordinates[0]
      );
      map.setView(latlng, 18);
      // Show a popup with property information
      showPropertyInfoPopup(foundProperty);
    } else {
      alert("No property found with address " + address);
    }
  });
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
    fillOpacity: 0.8
  };
}

function showCensusBlocksOnMap (map, column) {
  fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/census_with_counts_01.geojson')
  .then(response => response.json())
  .then(data => {
    let neighborhoods = L.geoJSON(data, {
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
    fillOpacity: 0.8
  };
}

function showNeighborhoodsOnMap(map, column) {
fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/neighborhood_with_counts.geojson')
  .then(response => response.json())
  .then(data => {
    let neighborhoods = L.geoJSON(data, {
      style: function(feature) {
        return styleMapNeighborhood(feature, column);
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