let autocompleteService;
let geocoder;
function initMap() {
    autocompleteService = new google.maps.places.AutocompleteService();
    geocoder = new google.maps.Geocoder();

    if (document.getElementById("from-search-box")) {
        setupLocationSearch(
            "from-search-box",
            "from-location-suggestions",
            "fromLat",
            "fromLng",
            "fromState",
            "fromCity"
        );
    }
    if (document.getElementById("to-search-box")) {
        setupLocationSearch(
            "to-search-box",
            "to-location-suggestions",
            "toLat",
            "toLng",
            "toState",
            "toCity"
        );
    }
}

function setupLocationSearch(inputId, suggestionListId, latId, lngId, stateId, cityId) {
    const input = document.getElementById(inputId);
    const suggestionsBox = document.getElementById(suggestionListId);
    let currentFocus = -1;

    input.addEventListener("input", function () {
        let query = this.value.trim();
        currentFocus = -1; 
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
            e.preventDefault(); 
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
        getLatLngAndState(prediction.place_id, latId, lngId, stateId, cityId);
    }

    document.addEventListener("click", function (e) {
        if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = "none";
        }
    });
}

function getLatLngAndState(placeId, latId, lngId, stateId, cityId) {
    geocoder.geocode({ placeId: placeId }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            let location = results[0].geometry.location;
            let lat = location.lat();
            let lng = location.lng();
            let state = "";
            let city = "";
            results[0].address_components.forEach(function (component) {
                if (component.types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }
                if (component.types.includes("locality")) {
                    city = component.long_name;
                }
            });
            document.getElementById(latId).value = lat.toFixed(6);
            document.getElementById(lngId).value = lng.toFixed(6);
            document.getElementById(stateId).value = state;
            document.getElementById(cityId).value = city;
        } else {
            toastr.error("Geocoder failed or no result:","Error");
        }
    });
}

