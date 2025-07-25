(function () {
    let map;
    let marker;
    let geocoder;
    let autocomplete;

    window.initMap = function () {
        const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // India center

        map = new google.maps.Map(document.getElementById("map"), {
            center: defaultLocation,
            zoom: 5,
        });

        geocoder = new google.maps.Geocoder();

        const input = document.getElementById("search-box");
        autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo("bounds", map);

        autocomplete.addListener("place_changed", function () {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                alert("No details available for input: '" + place.name + "'");
                return;
            }

            map.setCenter(place.geometry.location);
            map.setZoom(15);
            placeMarker(place.geometry.location);
            getLatLngState(place.geometry.location);
        });

        map.addListener("click", function (event) {
            placeMarker(event.latLng);
            getLatLngState(event.latLng);
        });

        const locationButton = document.createElement("button");
        locationButton.textContent = "📍 Current Location";
        locationButton.classList.add("btn", "btn-sm", "btn-primary", "mt-2");
        locationButton.style.position = "absolute";
        locationButton.style.top = "10px";
        locationButton.style.right = "10px";
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);

        locationButton.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        map.setCenter(pos);
                        map.setZoom(15);
                        placeMarker(pos);
                        getLatLngState(pos);
                    },
                    () => {
                        alert("Geolocation failed.");
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });
    };

    function placeMarker(location) {
        if (marker) {
            marker.setPosition(location);
        } else {
            marker = new google.maps.Marker({
                position: location,
                map: map,
            });
        }
    }

    function getLatLngState(latlng) {
        const lat = latlng.lat ? latlng.lat() : latlng.lat;
        const lng = latlng.lng ? latlng.lng() : latlng.lng;

        document.getElementById("latitude").value = lat.toFixed(6);
        document.getElementById("longitude").value = lng.toFixed(6);

        geocoder.geocode({ location: { lat, lng } }, function (results, status) {
            if (status === "OK") {
                if (results[0]) {
                    const components = results[0].address_components;
                    const stateComponent = components.find(c => c.types.includes("administrative_area_level_1"));
                    const state = stateComponent ? stateComponent.long_name : "N/A";
                    document.getElementById("state").value = state;
                } else {
                    alert("No results found");
                }
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    }

    window.openMapPopup = function () {
        $("#mapModalContent").load("/Map/MapPartial", function () {
            $("#mapModal").modal("show");

            // Wait for modal to be shown before initializing map
            $('#mapModal').on('shown.bs.modal', function () {
                initMap();
            });
        });
    };

})();
