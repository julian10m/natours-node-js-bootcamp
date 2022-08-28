export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoianVsaWFuMTBtIiwiYSI6ImNsN2Q1bW80YTBpOWczcHBneGwxazEwOHEifQ.sCjIulnGoGTfvYczmGTA8w';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/julian10m/cl7d7orbx000n14pnnuw3q4ox',
        scrollZoom: false
    });

    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
        bounds.extend(loc.coordinates);

        new mapboxgl.Popup({
            offset: 30,
            closeOnClick: false,
            focusAfterOpen: false
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });

}
