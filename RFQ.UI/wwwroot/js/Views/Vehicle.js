
const vehicleTypes = ["Car", "Bike", "Truck", "Bus", "Van"];
const vehicleCategories = ["Sedan", "SUV", "Hatchback", "Pickup", "Convertible"];
const ownerNames = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis", "Michael Brown"];
const trackingProviders = ["GPS Tracker Inc.", "FleetMonitor", "TrackMe", "GeoLocate", "NavTrack"];
const trackingDropdown = document.getElementById("trackingProvider");

// Get the dropdown element
const dropdown = document.getElementById("vehicleType");
const categoryDropdown = document.getElementById("vehicleCategory");
const ownerDropdown = document.getElementById("ownerName");

// Populate dropdown options
trackingProviders.forEach(provider => {
    let option = document.createElement("option");
    option.value = provider;
    option.textContent = provider;
    trackingDropdown.appendChild(option);
});

document.addEventListener("DOMContentLoaded", function () {
    GetAllVehicleCategory();
    GetAllVehicleTypeList();
    GetAllOwnerOrVendor();
    document.getElementById("save_click").addEventListener("click", validateForm);
    document.getElementById("save&new_click").addEventListener("click", validateForm);

    function validateForm(event) {
        event.preventDefault();
        let isValid = true;

        function showError(input) {
            input.classList.add("is-invalid");
        }

        function removeError(input) {
            input.classList.remove("is-invalid");
        }

        function validateRequired(input) {
            if (input.value.trim() === "") {
                showError(input);
                isValid = false;
            } else {
                removeError(input);
            }
        }

        const requiredFields = document.querySelectorAll(".form-label.required + .form-control, .form-label.required + .form-select");

        requiredFields.forEach(validateRequired);

        if (isValid) {
            event.target.closest("form").submit(); // Submit form if valid
        }
    }

    // Hide validation error on user input
    document.querySelectorAll(".form-control, .form-select").forEach(input => {
        input.addEventListener("input", function () {
            input.classList.remove("is-invalid");
        });
        input.addEventListener("change", function () {
            console.log(input)
            input.classList.remove("is-invalid");
        });
    });

    function GetAllVehicleCategory() {
        var GetUrl = '/Vehicle/GetAllVehicleCategory';
        $.ajax({
            url: GetUrl,
            type: "GET",
            contentType: "application/json",
            success: function (response) {
                const dropdown = document.getElementById("vehicleCategory");
                let placeholderOption = document.createElement("option");
                placeholderOption.value = "";
                placeholderOption.textContent = "Select Vehicle Type";
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                dropdown.appendChild(placeholderOption);
                // Add Other Options
                response.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.internalMasterId;
                    option.textContent = category.internalMasterName;
                    dropdown.appendChild(option);
                });
                $('.selectpicker').selectpicker('refresh');
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to submit Vehicle Type", "Error");
            }
        });
    }
});

$("#btnVehicleKyc").on("click", function () {
    var getUrl = '/Vehicle/GetVehicleKycDetails';
    var vehicleNo = $("#vehicleNo").val();

    // Request Body
    var Body = {
        VehicleNo: vehicleNo,
    }
    $.ajax({
        url: getUrl,
        type: "Post",
        contentType: "application/json charset=utf-8",
        data: JSON.stringify(Body),
        success: function (response) {
            var Data = response;
            var rcModel = response.vehicleRCModel;
            console.log(response);
            $("#vehicleNo").val(rcModel.vehicleNo);
            $("#vehicleType").val();
            $("#ownerName").val(rcModel.ownerName);
            $("#vehicleCategory").val(rcModel.vehicleCategory);
            $("#vehicleCapacity").val();
            $("#trackingProvider").val();
            $("#vehicleStatusInput").val(rcModel.vehicleRCStatus);
            $("#blacklistStatusInput").val(rcModel.nonUseStatus);
            $("#regdOwnerInput").val(rcModel.ownerName);
            $("#engineNoInput").val(rcModel.vehicleEngineNumber);
            $("#chasisNoInput").val(rcModel.vehicleChassisNumber);
            $("#makeModelInput").val(rcModel.vehicleMakerModel);
            $("#pucExpiryInput").val(rcModel.pucExpiryDate);
            $("#financerInput").val(rcModel.financier);
            $("#ownerSerialNoInput").val(rcModel.ownerSerialNo);
            $("#npNoInput").val(rcModel.nationalPermitNumber);
            $("#insuranceCoInput").val(rcModel.insuranceCompany);
            $("#verifiedOnInput").val(rcModel.issueDate);
            $("#rtoRegistrationInput").val(rcModel.registeredAt);
            $("#registrationDateInput").val(rcModel.issueDate);
            $("#permanentAddressInput").val(rcModel.permanentAddress);
            $("#grossWeightInput").val(rcModel.vehicleGrossWeight);
            $("#unladenWeightInput").val(rcModel.vehicleUnladenWeight);
            $("#fitnessExpiryInput").val(rcModel.expiryDate);
            $("#taxExpiryInput").val(rcModel.taxEndDate);
            $("#permitNoInput").val(rcModel.permitNumber);
            $("#permitExpiryInput").val(rcModel.permitExpiryDate);
            $("#npExpiryInput").val(rcModel.nationalPermitExpiryDate);
            $("#vehicleCapacityInput").val(rcModel.vehicleUnladenWeight);
            $("#policyNoInput").val(rcModel.pucNumber);
            $("#policyExpiryInput").val(rcModel.pucExpiryDate);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to submit Vehicle Type", "Error");
        }
    });
});

function ValidateTextbox(inputId) {
    var value = $("#" + inputId).val();
    var pattern = /^[A-Za-z0-9]+$/;

    if (!pattern.test(value)) {
        toster.warning("Invalid input in " + inputId + "! Only letters and numbers are allowed.");
        return false; // Invalid input
    }
    return true;
}

function ValidateForm() {
    var inputs = [
        "vehicleStatusInput", "blacklistStatusInput", "regdOwnerInput", "engineNoInput", "chasisNoInput",
        "makeModelInput", "pucExpiryInput", "financerInput", "ownerSerialNoInput", "npNoInput",
        "insuranceCoInput", "verifiedOnInput", "rtoRegistrationInput", "registrationDateInput",
        "permanentAddressInput", "grossWeightInput", "unladenWeightInput", "fitnessExpiryInput",
        "taxExpiryInput", "permitNoInput", "permitExpiryInput", "npExpiryInput", "vehicleCapacityInput",
        "policyNoInput", "policyExpiryInput"
    ];

    for (var i = 0; i < inputs.length; i++) {
        if (!ValidateTextbox(inputs[i])) {
            return false; // Stop validation on first error
        }
    }

    alert("All inputs are valid!");
    return true;
}

function GetAllVehicleTypeList() {
    var getVehicleTypeUrl = '/Vehicle/GetAllMasterVehicleType'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const vehicleTypedropdown = document.getElementById("vehicleType");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Vehicle Type";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleTypedropdown.appendChild(placeholderOption);

            // Add Other Options

            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.vehicleTypeId;
                option.textContent = item.vehicleTypeName;
                vehicleTypedropdown.appendChild(option);
            });

            $('.selectpicker').selectpicker('refresh');
            //End
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}

function GetAllOwnerOrVendor() {
    var getAllOwnerOrVendorUrl = '/Vehicle/GetAllOwnerOrVendor'
    $.ajax({
        url: getAllOwnerOrVendorUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const ownerDropdown = document.getElementById("ownerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Owner Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            ownerDropdown.appendChild(placeholderOption);

            // Add Other Options
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                ownerDropdown.appendChild(option);
            });

            $('.selectpicker').selectpicker('refresh');
            //End
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
