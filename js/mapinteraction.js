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
  const layer = e.target;

  layer.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

export{
  highlightFeature,
  resetHighlight,
  zoomToFeature,
}