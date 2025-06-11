let map;
let service;
let infowindow;

document.addEventListener('DOMContentLoaded', () => {
    const findParksButton = document.getElementById('findParks');
    const parkList = document.getElementById('parkList');

    findParksButton.addEventListener('click', findNearbyParks);

    function initMap(lat, lng) {
        const location = new google.maps.LatLng(lat, lng);
        map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 12
        });

        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
    }

    function findNearbyParks() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                initMap(lat, lng);

                const request = {
                    location: new google.maps.LatLng(lat, lng),
                    radius: '5000',
                    keyword: 'skatepark'
                };

                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        displayParks(results.slice(0, 3));
                    }
                });
            }, (error) => {
                console.error('Error:', error);
            });
        } else {
            alert('Geolocation is not supported by your browser');
        }
    }

    function displayParks(parks) {
        parkList.innerHTML = '';
        parks.forEach((park, i) => {
            const li = document.createElement('li');
            li.textContent = `${i + 1}. ${park.name} - ${park.vicinity}`;
            parkList.appendChild(li);

            createMarker(park);
        });
    }

    function createMarker(place) {
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', () => {
            infowindow.setContent(place.name);
            infowindow.open(map, marker);
        });
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(error => console.log('ServiceWorker registration failed:', error));
    });
}
