
mapboxgl.accessToken = mapToken;
// mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZWVuYTEyMyIsImEiOiJjbDl0dWlsMzIxZzF5M25wbW0yMTV2cW9wIn0.rCkrLiYIzz_5CxaoIoztOw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11', // stylesheet location
    center: campground.geometry.coordinates,  // starting position [lng, lat]
    zoom: 4 // starting zoom
});

//ADD ZOOM AND ROTATION CONTROLS TO THE MAP
map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

 new mapboxgl.Marker()
 .setLngLat(campground.geometry.coordinates)
 .setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
        )
)
 .addTo(map)



