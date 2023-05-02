import { mapInitialize, showPropertiesOnMap, showNeighborhoodsOnMap, clearMap, toggleMapFeatures, showCensusBlocksOnMap, getColorNeighborhood} from "./map.js";
import { searchForAddress } from "./search.js";
import {} from "./mapinteraction.js"
import { showTable } from "./table.js";

// Show the popup when the page is fully loaded
// window.addEventListener("load", () => {
//   const popup = document.getElementById("popup");
//   popup.style.display = "block";
// });

 
//Initialize the evictionMap
const evictionMap  = mapInitialize();
showNeighborhoodsOnMap(evictionMap, "eviction_count_total");

//create the control layer
const info = L.control();

  info.onAdd = function (evictionMap) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    const contents = props ? `<b>${props.name}</b><br />${props.eviction_count_total} evictions from 2016 </sup><br />${props.pred} evictions predictions` : 'Hover over a state';
    this._div.innerHTML = `<h4>Philadelphia Neighborhoods</h4>${contents}`;
  };

info.addTo(evictionMap);

evictionMap.attributionControl.addAttribution('© wuzile98@outlook.com</a>');

// map zoom function:
const buttonClick = false;
if (!buttonClick){
  evictionMap.on('zoomend', function() {
    toggleMapFeatures(evictionMap, "eviction_count_total");
  });
}


const legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		const div = L.DomUtil.create('div', 'info legend');
		const labels = [
      `<i style="background: ${"#2e2345"}"></i>${"Extremely HighVery"}`,
      `<i style="background: ${"#524d60"}"></i>${"Very High"}`,
      `<i style="background: ${"#a57569"}"></i>${"High"}`,
      `<i style="background: ${"#d19b75"}"></i>${"Moderate"}`,
      `<i style="background: ${"#e4dbc4"}"></i>${"Low"}`,
      `<i style="background: ${"#f5f2ec"}"></i>${"Very Low"}`
      ];
		// let from, to;

		// for (let i = 0; i < grades.length; i++) {
		// 	from = grades[i];
		// 	to = grades[i + 1];

		// 	labels.push(`<i style="background:${getColorNeighborhood(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
		// }

		div.innerHTML = labels.join('<br>');
		return div;
	};

legend.addTo(evictionMap);
// evictionMap.removeControl(legend);



const searchBar = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const loader = document.querySelector('.loader');

searchButton.addEventListener("click", () => {
  const address = searchBar.value.trim().toUpperCase();
  searchBar.disabled = true;
  loader.style.display = 'inline-block';
  const newView = searchForAddress(evictionMap, address, function(){
    loader.style.display = 'none';
    searchBar.disabled = false;
  });
});

const checkbox1 = document.querySelectorAll('#checkbox1');
const checkbox2 = document.querySelectorAll('#checkbox2');
const filter1 = document.querySelector('#property-select');
const filter2 = document.querySelector('#time-select');

console.log(filter2);
  
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
      clearMap(evictionMap);
      showCensusBlocksOnMap(evictionMap, column);
  })});
 
  filter1.addEventListener('click', function () {
    const filterValue = this.value;

    clearMap(evictionMap);

    if (filterValue == "neighborhood") {
      const center = evictionMap.getCenter();
      evictionMap.setView(center, 12);
      showNeighborhoodsOnMap(evictionMap, "eviction_count_total");
    // } else if (filterValue == "census_tract") {
    //   const center = evictionMap.getCenter();
    //   evictionMap.setView(center, 12);
    //   showCensusBlocksOnMap(evictionMap, "eviction_count_total");
    } else if (filterValue == "property") {
      const center = evictionMap.getCenter();
      evictionMap.setView(center, 17);
      showPropertiesOnMap(evictionMap);
    }
  })

  filter2.addEventListener('click', function () {
    const filterValue = this.value;

    clearMap(evictionMap);

    if (filterValue == "eviction_count_total") {
      showNeighborhoodsOnMap(evictionMap, "eviction_count_total");
    } else if (filterValue == "predictions") {
      showNeighborhoodsOnMap(evictionMap, "predictions");
    } 

    // // show all properties on map based on the url
    // evictionMap.on('zoomend', function() {
    //   toggleMapFeatures(evictionMap, filterValue);
    // });

    }

  )

  

showTable(evictionMap, "https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/address_search_01.json", "predictions", "list");




window.evictionMap = evictionMap;
window.info = info;
window.legend = legend;
// window.info = info;