function mapInitialize(){
    //initialize the map variable as evictionMap and retrun the variable
    let map = L.map('eviction-map').setView([39.952436849966794, -75.16356820883757], 11);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    return map;
}

export{
    mapInitialize,
};