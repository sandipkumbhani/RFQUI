let autocompleteService;
let geocoder;

// Google Maps API will call this function automatically after loading
function initMap() {
    autocompleteService = new google.maps.places.AutocompleteService();
    geocoder = new google.maps.Geocoder();

    // Initialize both inputs
    setupLocationSearch(
        "from-search-box",
        "from-location-suggestions",
        "fromLat",
        "fromLng",
        "fromState"
    );

    setupLocationSearch(
        "to-search-box",
        "to-location-suggestions",
        "toLat",
        "toLng",
        "toState"
    );
}

function setupLocationSearch(inputId, suggestionListId, latId, lngId, stateId) {
    const input = document.getElementById(inputId);
    const suggestionsBox = document.getElementById(suggestionListId);
    let currentFocus = -1;

    input.addEventListener("input", function () {
        let query = this.value.trim();
        currentFocus = -1; // Reset focus
        if (query.length > 2) {
            autocompleteService.getPlacePredictions({
                input: query,
                componentRestrictions: { country: 'in' }
            }, function (predictions, status) {
                suggestionsBox.innerHTML = "";
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    predictions.forEach(function (prediction, index) {
                        let li = document.createElement("li");
                        li.classList.add("list-group-item", "list-group-item-action");
                        li.textContent = prediction.description;
                        li.setAttribute("data-place-id", prediction.place_id);

                        li.addEventListener("click", function () {
                            selectPrediction(prediction);
                        });

                        suggestionsBox.appendChild(li);
                    });
                    suggestionsBox.style.display = "block";
                } else {
                    suggestionsBox.style.display = "none";
                }
            });
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    input.addEventListener("keydown", function (e) {
        let items = suggestionsBox.getElementsByTagName("li");
        if (e.key === "ArrowDown") {
            currentFocus++;
            highlightItem(items);
        } else if (e.key === "ArrowUp") {
            currentFocus--;
            highlightItem(items);
        } else if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            }
        }
    });

    function highlightItem(items) {
        if (!items || items.length === 0) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add("active");
    }

    function removeActive(items) {
        for (let item of items) {
            item.classList.remove("active");
        }
    }

    function selectPrediction(prediction) {
        input.value = prediction.description;
        suggestionsBox.style.display = "none";
        getLatLngAndState(prediction.place_id, latId, lngId, stateId);
    }

    document.addEventListener("click", function (e) {
        if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = "none";
        }
    });
}

function getLatLngAndState(placeId, latId, lngId, stateId) {
    geocoder.geocode({ placeId: placeId }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            console.log(results[0]); // Log the full result for debugging)
            let location = results[0].geometry.location;
            let lat = location.lat();
            let lng = location.lng();
            let state = "";

            results[0].address_components.forEach(function (component) {
                if (component.types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }
            });

            // Log values in console
            console.log("Selected Location Details:");
            console.log("Latitude:", lat.toFixed(6));
            console.log("Longitude:", lng.toFixed(6));
            console.log("State:", state);

            // Store values in hidden inputs
            document.getElementById(latId).value = lat.toFixed(6);
            document.getElementById(lngId).value = lng.toFixed(6);
            document.getElementById(stateId).value = state;
        } else {
            console.error("Geocoder failed or no result:", status);
        }
    });
}

