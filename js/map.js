import { highlightFeature, resetHighlight } from "./mapinteraction.js"

function mapInitialize(){
  //initialize the map variable as evictionMap and retrun the variable
  
  let map = L.map('eviction-map').setView([39.971848818250976, -75.15918249958725], 11);

      const mapboxAccount = 'mapbox';
      const mapboxStyle = 'light-v10';
      const mapboxToken = 'pk.eyJ1IjoibmFuYWZhaXIiLCJhIjoiY2tyMnhiaWtrMWNhMjJ4bGQwMXNjbnk1eiJ9.Yh8LEXOsedeTLZye9PnjIw';

      L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`, {
      maxZoom: 19,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      }).addTo(map);

  return map;
  }


function showPropertiesOnMap(map) {
  // Load the vector tile layer
  let tileLayer = L.vectorGrid.protobuf(
    "https://storage.googleapis.com/wzl_data_lake/tiles_01/properties/{z}/{x}/{y}.pbf",
    {
      rendererFactory: L.canvas.tile,
      interactive: true,

      vectorTileLayerStyles: {
        parcel_with_counts_trim_1: function(properties, zoom) {
          var count = properties.eviction_count_total;
          console.log(count);
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

  tileLayer.highlightFeature = (featureid) => {
    if (tileLayer.selectedFeatureId) {
      tileLayer.resetFeatureStyle(tileLayer.selectedFeatureId);
    }

    tileLayer.selectedFeatureId = featureid;
    tileLayer.setFeatureStyle(featureid, 
      {
      weight: 4,
      color: 'black',
      fillColor: 'red',
      fillOpacity: 0.7,
      fill: true
    });
  }
  // tileLayer.on("click", (event) => {
  //   console.log(event);
  //   var popup = L.popup()
  //   .setLatLng(event.latlng)
  //   .setContent(
  //     "Eviction_count_total: <br />"+event.layer.properties.eviction_count_total+
  //     "<br />"+"Address: <br />"+event.layer.properties.ADDRESS+
  //     "<br />"+"Predictions: <br />" + event.layer.properties.pred4)
  //   .openOn(map);

  // tileLayer.highlightFeature(event.layer.properties.parcel_number);

  // })
  tileLayer.on("click", (event) => {
    console.log(event);
    var popupContent = `
      <div class="popup">
        <h4>${event.layer.properties.ADDRESS}</h4>
        <h4>Predictions ${event.layer.properties.pred4}</h4>
        <h4>Property Infomation</h4>
        <p>
          Eviction Count: ${event.layer.properties.eviction_count_total}<br/>
          Market Value: ${event.layer.properties.market_value}<br/>
          Total Livable Area: ${event.layer.properties.total_livable_area}<br/>
          Built Year: ${event.layer.properties.built_year}<br/>
          Zoning: ${event.layer.properties.zoning}
        </p>

        <h4>Historical Violation Count:  ${event.layer.properties.violation_count} </h4>
        
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Season 1</th>
              <th>Season 2</th>
              <th>Season 3</th>
              <th>Season 4</th>
            </tr>
          </thead>
          <h4>Historical Eviction Records</h4>
          <tbody>
            <tr>
              <td> 2016 </td>
              <td>${event.layer.properties["2016S1"]}</td>
              <td>${event.layer.properties["2016S2"]}</td>
              <td>${event.layer.properties["2016S3"]}</td>
              <td>${event.layer.properties["2016S4"]}</td>
            </tr>
            <tr>
              <td> 2017 </td>
              <td>${event.layer.properties["2017S1"]}</td>
              <td>${event.layer.properties["2017S2"]}</td>
              <td>${event.layer.properties["2017S3"]}</td>
              <td>${event.layer.properties["2017S4"]}</td>
            </tr>
            <tr>
              <td> 2018 </td>
              <td>${event.layer.properties["2018S1"]}</td>
              <td>${event.layer.properties["2018S2"]}</td>
              <td>${event.layer.properties["2018S3"]}</td>
              <td>${event.layer.properties["2018S4"]}</td>
            </tr>
            <tr>
              <td> 2019 </td>
              <td>${event.layer.properties["2019S1"]}</td>
              <td>${event.layer.properties["2019S2"]}</td>
              <td>${event.layer.properties["2019S3"]}</td>
              <td>${event.layer.properties["2019S4"]}</td>
            </tr>
            <tr>
              <td> 2020 </td>
              <td>${event.layer.properties["2020S1"]}</td>
              <td>${event.layer.properties["2020S2"]}</td>
              <td>${event.layer.properties["2020S3"]}</td>
              <td>${event.layer.properties["2020S4"]}</td>
            </tr>
            <tr>
              <td> 2021 </td>
              <td>${event.layer.properties["2021S1"]}</td>
              <td>${event.layer.properties["2021S2"]}</td>
              <td>${event.layer.properties["2021S3"]}</td>
              <td>${event.layer.properties["2021S4"]}</td>
            </tr>
            <tr>
              <td> 2022 </td>
              <td>${event.layer.properties["2022S1"]}</td>
              <td>${event.layer.properties["2022S2"]}</td>
              <td>${event.layer.properties["2022S3"]}</td>
              <td>${event.layer.properties["2022S4"]}</td>
            </tr>
            
          </tbody>
        </table>
    
      </div>
    `;
    var popup = L.popup({
      closeButton: false,
      minWidth: 200,
      className: 'custom-popup'
    })
    .setLatLng(event.latlng)
    .setContent(popupContent)
    .openOn(map);
  
    tileLayer.highlightFeature(event.layer.properties.parcel_number);
  
  });

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
      },
      onEachFeature: function(feature, layer) {
        layer.on({
          mouseover: function(e) {
            const layer = e.target;

            layer.setStyle({
              weight: 5,
              color: 'red',
              dashArray: '',
              fillColor: 'red',
              fillOpacity: 0.7
            });

            layer.bringToFront();

            info.update(layer.feature.properties);
          },
          
          mouseout: function(e) {
            census_tract.resetStyle(e.target);
          }
        })
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

function getColorNeighborhood_01 (column) {
  let color = "";

    if (column < 5){
      color = "#f5f2ec";
    } else if (column >= 5 && column < 10 ) {
      color = "#e4dbc4"
    } else if (column >= 10 && column < 20) {
      color = "#d19b75"
    } else if (column >= 20 && column < 30) {
      color = "#a57569"
    } else if (column >= 30 && column < 40) {
      color = "#524d60"
    } else {
      color = "#2e2345"
    }
    return color;
  
}

function styleMapNeighborhood(feature, column){
  if (column == "eviction_count_total"){
    return {
      fillColor: getColorNeighborhood(feature.properties.eviction_count_total),
      weight: 2,
      color: 'black',
      opacity: 1,
      dashArray: '3',
      fillOpacity: 0.65
    }
  } else if (column == "predictions"){
    return {
      fillColor: getColorNeighborhood_01(feature.properties.pred),
      weight: 2,
      color: 'black',
      opacity: 1,
      dashArray: '3',
      fillOpacity: 0.65
    }
  }
  
}


function showNeighborhoodsOnMap(map, column) {
fetch('https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/neighborhoods.geojson')
  .then(response => response.json())
  .then(data => {
    console.log(data);
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

        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
        })
      },

      onEachFeature: function(feature, layer) {
        layer.on({
          mouseover: function(e) {
            const layer = e.target;

            layer.setStyle({
              weight: 5,
              color: 'red',
              dashArray: '',
              fillColor: 'red',
              fillOpacity: 0.7
            });

            layer.bringToFront();

            info.update(layer.feature.properties);
          },
          
          mouseout: function(e) {
            neighborhoods.resetStyle(e.target);
          }
        })
      }
    }).addTo(map);

    return neighborhoods;
    
  });
}

function toggleMapFeatures(map, column) {
  let zoomLevel = map.getZoom();
  map.eachLayer(function (layer) {
    // check if layer is a tile layer (i.e. base map layer)
    if (layer instanceof L.TileLayer) {
      return;
    }
    map.removeLayer(layer);
  });

  if (zoomLevel < 16) {
    // show neighborhoods
    showNeighborhoodsOnMap(map, column);
  } 
  // else if (zoomLevel >= 14 && zoomLevel <= 16) {showCensusBlocksOnMap(map);} 
  else if (zoomLevel >= 16) {
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
  getColorNeighborhood,
};