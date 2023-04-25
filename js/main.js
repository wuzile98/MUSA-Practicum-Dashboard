import { mapInitialize, showPropertiesOnMap, showNeighborhoodsOnMap, clearMap, toggleMapFeatures, showCensusBlocksOnMap} from "./map.js";
import { handleSearchButtonClick } from "./search.js";

//Initialize the evictionMap
const evictionMap  = mapInitialize();
showNeighborhoodsOnMap(evictionMap);
showPropertiesOnMap(evictionMap);

// show all properties on map based on the url
evictionMap.on('zoomend', function() {
  toggleMapFeatures(evictionMap);
});

// showPointsOnMap(evictionMap);
// showCensusBlocksOnMap(evictionMap);

const checkbox1 = document.querySelectorAll('#checkbox1');
const checkbox2 = document.querySelectorAll('#checkbox2');
  
  checkbox1.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      let column = this.value;
      console.log(column);
      clearMap(evictionMap);
      showNeighborhoodsOnMap(evictionMap, column);
  })});

  checkbox2.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      let column = this.value;
      console.log(column);
      clearMap(evictionMap);
      showCensusBlocksOnMap(evictionMap, column);
  })});

window.evictionMap = evictionMap;