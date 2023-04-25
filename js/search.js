function searchPropertyByAddress(address, tileLayer) {
    let foundProperty = null;
    tileLayer.eachLayer(function(layer) {
      let layerAddress = layer.feature.properties.ADDRESS;
      if (layerAddress && layerAddress.toUpperCase() === address.toUpperCase()) {
        foundProperty = layer.feature;
        return;
      }
    });
    return foundProperty;
  }

  function showPropertyInfoPopup(map, feature) {
    let popupContent = '<b>' + feature.properties.ADDRESS + '</b><br>';
    popupContent += 'Owner: ' + feature.properties.OWNER + '<br>';
    popupContent += 'Assessed Value: $' + feature.properties.AV_TOTAL.toLocaleString() + '<br>';
    L.popup()
      .setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
      .setContent(popupContent)
      .openOn(map);
  }

function handleSearchButtonClick(map, tileLayer) {
    // Add event listener to the search button
    let searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', function() {
      let searchInput = document.getElementById('search-input');
      let address = searchInput.value.trim();
      let foundProperty = searchPropertyByAddress(address, tileLayer);
      if (foundProperty) {
        // Pan and zoom to the property location
        let latlng = L.latLng(foundProperty.geometry.coordinates[1], foundProperty.geometry.coordinates[0]);
        map.setView(latlng, 18);
        // Show a popup with property information
        showPropertyInfoPopup(map, foundProperty);
      } else {
        alert('No property found with address ' + address);
      }
    });
  }

export{
    searchPropertyByAddress,
    showPropertyInfoPopup,
    handleSearchButtonClick,
};