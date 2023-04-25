import { mapInitialize, showPropertiesOnMap, showNeighborhoodsOnMap, clearMap, toggleMapFeatures, showCensusBlocksOnMap} from "./map.js";
import { handleSearchButtonClick } from "./search.js";

//Initialize the evictionMap
const evictionMap  = mapInitialize();
showNeighborhoodsOnMap(evictionMap);

// show all properties on map based on the url
evictionMap.on('zoomend', function() {
  toggleMapFeatures(evictionMap);
});

const info  = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  const contents = props ? `<b>${props.name}</b><br />${props.density} people / mi<sup>2</sup>` : 'Hover over a state';
  this._div.innerHTML = `<h4>US Population Density</h4>${contents}`;
};

info.addTo(evictionMap);

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
window.info = info;