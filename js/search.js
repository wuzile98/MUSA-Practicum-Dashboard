/**
 * get the address_search.csv data from "https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/address_search.json"
 */
function searchForAddress(map, address) {
  // Load the JSON file containing the posts
  fetch("https://storage.googleapis.com/wzl_data_lake/phl_opa_properties/address_search.json")
    .then(response => response.json())
    .then(posts => {
      // Search for the first post containing the given address
      const post = posts.find(post => post.address.includes(address));
      // If found, display the post
      if (post) {
        console.log(post);
        const geog = [post.lat, post.lng];
        const parcel_number = post.parcel_number;
        console.log(geog);

        //reset the mapView based on the property lat lng
        map.setView(geog, 18);

        //style the maptile based on the parcel_number
        if (map.propertiesLayer.parcel_number == parcel_number) {


        }
      } else {
        console.log(`No post found with address "${address}"`);
      }
    })
    .catch(error => {
      console.error("Error loading posts:", error);
    });
}

export{
  searchForAddress
}