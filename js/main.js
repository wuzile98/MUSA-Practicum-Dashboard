import { mapInitialize, showCensusBlocksOnMap, showNeighborhoodsOnMap, showPropertiesOnMap } from "./map.js";

//Initialize the evictionMap
var evictionMap  = mapInitialize();

//show all properties on map based on the url
// showPropertiesOnMap(evictionMap);
// showNeighborhoodsOnMap(evictionMap);
showCensusBlocksOnMap(evictionMap);

window.evictionMap = evictionMap;