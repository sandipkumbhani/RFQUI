$(document).ready(function () {

    $('#ddlIndentNo').on('change', function () {
        
        const selectedValue = $(this).val();

        const selectedIndent = VehicIndentList.find(x => x.indentId == selectedValue);

        if (selectedIndent) {
            
            $('#txtIndentDate').val(selectedIndent.indentDate);
            let dateValue = selectedIndent.indentDate;
            if (dateValue) {
                // If it's a Date object, format it
                if (dateValue instanceof Date) {
                    dateValue = dateValue.toISOString().split('T')[0];
                } else if (typeof dateValue === "string" && dateValue.includes("T")) {
                    dateValue = dateValue.split('T')[0];
                }
                $('#txtIndentDate').val(dateValue);
            } else {
                $('#txtIndentDate').val('');
            }
            $("#ddlCustomerName").val(selectedIndent.partyId).trigger('change');
            $("#ddlVehicleType").val(selectedIndent.vehicleTypeId).trigger('change');
            $("#ddlOrigin").val(selectedIndent.fromLocation).trigger('change');
            $("#ddlDestination").val(selectedIndent.toLocation).trigger('change');
            $('#txtNoOfVehicles').val(selectedIndent.requiredVehicles);
            $('#txtVehicleReqOn').val(selectedIndent.vehicleReqOn);
            if (dateValue) {
                // If it's a Date object, format it
                if (dateValue instanceof Date) {
                    dateValue = dateValue.toISOString().split('T')[0];
                } else if (typeof dateValue === "string" && dateValue.includes("T")) {
                    dateValue = dateValue.split('T')[0];
                }
                $('#txtVehicleReqOn').val(dateValue);
            } else {
                $('#txtVehicleReqOn').val('');
            }

        }
    });
    $('#ddlVehicleNo').on('change', function () {
        const selectedValue = $(this).val();
        const selectedVehicle = VehicleList.find(x => x.vehicleId == selectedValue);
        if (selectedVehicle) {
            $("#ddlOwnerName").val(selectedVehicle.ownerVendorId).trigger('change');            
        }
    });
    GetAllLocation(); 
    GetAllDriver();
    GetAllVehicleIndent();
    GetAllVehicleNumber();
    FetchPlacementNo();
    GetAllOwnerOrVendor();
    GetAllStateList("ddlOrigin");
    GetAllStateList("ddlDestination");
    GetAllCustomer("ddlCustomerName");
    GetAllVehicleType("ddlVehicleType");
});

function GetAllLocation() {
    $.ajax({
        url: '/Location/GetAllLocationList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById("ddlLocation");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Location";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.locationId;
                opt.textContent = option.locationName;
                selectLocation.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllDriver() {
    $.ajax({
        url: '/Driver/GetAllDriverList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById("ddlDriverName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Driver";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.driverId;
                opt.textContent = option.driverName;
                selectLocation.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllVehicleIndent() {
    var getVehicleTypeUrl = '/RequestForQuote/GetAllVehicleIndentList'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            response = response.result;
            VehicIndentList = response;
            const Indentdropdown = document.getElementById("ddlIndentNo");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Indent No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            Indentdropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.indentId;
                option.textContent = item.indentNo;
                Indentdropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function GetAllVehicleNumber() {
    $.ajax({
        url: '/Vehicle/GetVehicleNumber',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            VehicleList = response;
            const selectVehicleNumber = document.getElementById("ddlVehicleNo");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Vehicle No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectVehicleNumber.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.vehicleId;
                opt.textContent = option.vehicleNo;
                selectVehicleNumber.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function FetchPlacementNo() {
    
    $.ajax({
        url: "/VehiclePlacement/GetPlacementNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtPlacementNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Placement No!", "Error");
        }
    });
}
function GetAllOwnerOrVendor() {
    var getAllOwnerOrVendorUrl = "/Vehicle/GetAllOwnerOrVendor";

    $.ajax({
        url: getAllOwnerOrVendorUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const ownerdropdown = document.getElementById("ddlOwnerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Owner Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            ownerdropdown.appendChild(placeholderOption);


            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                ownerdropdown.appendChild(option);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch Owner/Vendor Data!", "Error");
        }
    });
}
