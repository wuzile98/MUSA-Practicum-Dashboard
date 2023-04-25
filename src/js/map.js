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

function showCensusBlocksOnMap (map) {
  fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/census_tract.geojson')
  .then(response => response.json())
  .then(data => {
    let census_tract = L.geoJSON(data).addTo(map);
  });
}

function clearMap(map) {
map.eachLayer(function(layer) {
  if (layer instanceof L.GeoJSON) {
    map.removeLayer(layer);
  }
});
}

function getColor (column) {
console.log(column);
let color = "";
if (column < 10000000){
  color = "red";
} else {
  color = "blue";
}
return color;
}

function styleMap(feature, columns) {
let color = 'black';
console.log(columns);
// let maxNumber = Math.max(...columns);
// console.log(maxNumber);
if (feature.properties.hasOwnProperty(columns)) {
  color = getColor(feature.properties[columns]);
}
return {
  color: 'black',
  weight: 2,
  fillColor: color,
  fillOpacity: 0.5
};
}


function showNeighborhoodsOnMap(map, column) {
fetch('https://raw.githubusercontent.com/azavea/geo-data/master/Neighborhoods_Philadelphia/Neighborhoods_Philadelphia.geojson')
  .then(response => response.json())
  .then(data => {
    let neighborhoods = L.geoJSON(data, {
      style: function(feature) {
        return styleMap(feature, column);
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
} else {
  // show property points
  //showCensusBlocksOnMap(map);
  showPropertiesOnMap(map);
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