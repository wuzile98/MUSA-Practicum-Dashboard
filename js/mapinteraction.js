function createMap() {
    const map = L.map('map').setView([37.8, -96], 4);
  
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  
    const infoNeighborhood = createInfoControl();
    infoNeighborhood.addTo(map);
  
    const geojsonNeighborhood = createGeoJsonLayer(statesData);
    geojsonNeighborhood.addTo(map);
  
    const legendNeighborhood = createLegendControl();
    legendNeighborhood.addTo(map);
  
    map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
  }
  
  function createInfoControl() {
    const info = L.control();
  
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };
  
    info.update = function (props) {
      const contents = props ? `<b>${props.name}</b><br />${props.density} people / mi<sup>2</sup>` : 'Hover over a state';
      this._div.innerHTML = `<h4>US Population Density</h4>${contents}`;
    };
  
    return info;
  }
  
  function createGeoJsonLayer(data) {
    const geojson = L.geoJson(data, {
      style: createStyleFunction,
      onEachFeature: createEachFeatureFunction
    });
  
    return geojson;
  }
  
  function createStyleFunction(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.density)
    };
  }
  
  function getColor(d) {
    return d > 1000 ? '#800026' :
      d > 500  ? '#BD0026' :
      d > 200  ? '#E31A1C' :
      d > 100  ? '#FC4E2A' :
      d > 50   ? '#FD8D3C' :
      d > 20   ? '#FEB24C' :
      d > 10   ? '#FED976' : '#FFEDA0';
  }
  
  function createEachFeatureFunction(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }
  
  function highlightFeature(e) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
  
    layer.bringToFront();
  
    info.update(layer.feature.properties);
  }
  
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }
  
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }
  
  function createLegendControl() {
    const legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
  
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
      const labels = [];
      let from, to;
  
      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades}
    }
  }

