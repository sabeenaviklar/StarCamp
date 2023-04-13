
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'cluster-map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/outdoors-v11',
// center: [-103.5917, 40.6699],
center: [-103.5800, 40.8000],
zoom: 1
});

//ADD ZOOM AND ROTATION CONTROLS TO THE MAP
map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

 

//MAP LOADED
map.on('load', () => {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('campgrounds', {
type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ campgrounds
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
data: campgrounds,
cluster: true,
clusterMaxZoom: 14, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campgrounds',
filter: ['has', 'point_count'],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Violet, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Blue, 40px circles when point count is greater than or equal to 750
'circle-color': [
'step',
['get', 'point_count'],
'pink',  //PINK
100,
'#f1f075',   //YELLOW
750,
'#0099cc'   //BLUE
],
'circle-radius': [
'step',
['get', 'point_count'],
20,       //SIZE
100,      //IN THE STAGE(interval) in WHICH YOU WANT TO CHANGE THE COLOR
30,      //SIZE
750,     //IN THE STAGE(interval)  WHICH YOU WANT TO CHANGE   THE COLOR
40       //SIZE
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campgrounds',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 

//FOR ONLY (ONE)SINGLE UNCLUSTERED POINT
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'campgrounds',
filter: ['!', ['has', 'point_count']],  //NOT HAS POINT_COUNT
paint: {
'circle-color': '#9900cc', //violet
'circle-radius': 6,
'circle-stroke-width': 1.5,
'circle-stroke-color': '#fff'
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', (e) => {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('campgrounds').getClusterExpansionZoom(
clusterId,
(err, zoom) => {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
// When a click event occurs on a feature in
// the unclustered-point(small points 🛑) layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', (e) => {
const {popUpMarkup} = e.features[0].properties;
const coordinates = e.features[0].geometry.coordinates.slice();

 


// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(popUpMarkup)
.addTo(map);
});
 

//FUNCTION WHEN A MOUSE IS OVER THE CLUSTER POINTS 🛑 🛑
map.on('mouseenter', 'clusters', () => {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
map.getCanvas().style.cursor = '';
});
});
