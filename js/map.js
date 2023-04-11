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

function showNeighborhoodsOnMap(map) {
  fetch('https://raw.githubusercontent.com/azavea/geo-data/master/Neighborhoods_Philadelphia/Neighborhoods_Philadelphia.geojson')
    .then(response => response.json())
    .then(data => {
      let neighborhoods = L.geoJSON(data, {
        style: {
          color: 'black',
          weight: 2
        }
      }).addTo(map);
    });
}
    
function showCensusBlocksOnMap(map) {
    fetch('D:/Upenn/Upenn Lec/09-MUSA-Practicum/Dashboard/MUSA-Practicum-Dashboard/data/Census_Block_Groups_2010.geojson')
      .then(response => response.json())
      .then(data => {
        let censusBlocks = L.geoJSON(data, {
          style: {
            color: 'black',
            weight: 2
          }
        }).addTo(map);
      });
  }

export{
    mapInitialize,
    showPropertiesOnMap,
    showNeighborhoodsOnMap,
    showCensusBlocksOnMap,
};