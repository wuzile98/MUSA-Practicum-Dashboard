function showTable(map, url, column, elementId) {
    console.log("Fetching data from " + url);
    
    // Fetch the JSON data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log("Data loaded:", data);
        
        // Sort the data by the specified column in descending order
        data.sort((a, b) => b[column] - a[column]);
        
        // Get the top 10 rows based on the sorted data
        const top10 = data.slice(0, 10);
        
        console.log("Top 10 rows:", top10);
        
        // Create an HTML list of the top 10 rows
        const list = document.getElementById(elementId);
          top10.forEach(row => {
            const item = document.createElement("li");
            item.textContent = `Address: ${row["address"]}, Eviction predictions: ${row["predictions"]}`;
            item.addEventListener("click", () => {
              const geog = [row["lat"], row["lng"]];
              const parcel_number = row["parcel_number"];
              console.log("Clicked item:", geog);

              map.setView(geog, 17);
              setTimeout(() => {
                map.propertiesLayer.highlightFeature(parcel_number);
              }, 250);

            });
            list.appendChild(item);
          });
        
        console.log("List created:", list);
      })
      .catch(error => console.error(error));
  }

export{
    showTable
}