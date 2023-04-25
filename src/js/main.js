import { mapInitialize, showPropertiesOnMap, showNeighborhoodsOnMap, clearMap, toggleMapFeatures, showCensusBlocksOnMap} from "./map.js";

//Initialize the evictionMap
const evictionMap  = mapInitialize();
showNeighborhoodsOnMap(evictionMap);
showCensusBlocksOnMap(evictionMap);

// show all properties on map based on the url
evictionMap.on('zoomend', function() {
  toggleMapFeatures(evictionMap);
});

// showPointsOnMap(evictionMap);
// showCensusBlocksOnMap(evictionMap);

let checkboxes = document.querySelectorAll('input[type=checkbox]');
  
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      let column = this.value;
      console.log(column);
      clearMap(evictionMap);
      showNeighborhoodsOnMap(evictionMap, column);
  })});

window.evictionMap = evictionMap;