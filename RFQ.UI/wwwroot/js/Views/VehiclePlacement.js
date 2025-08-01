var companyId;

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    $('#ddlIndentNo').on('change', function () {
        AutoFetch();
        //const selectedValue = $(this).val();
        //const selectedIndent = VehicIndentList.find(x => x.indentId == selectedValue);

        //if (selectedIndent) {
            
        //    $('#txtIndentDate').val(selectedIndent.indentDate);
        //    let dateValue = selectedIndent.indentDate;
        //    if (dateValue) {
        //        // If it's a Date object, format it
        //        if (dateValue instanceof Date) {
        //            dateValue = dateValue.toISOString().split('T')[0];
        //        } else if (typeof dateValue === "string" && dateValue.includes("T")) {
        //            dateValue = dateValue.split('T')[0];
        //        }
        //        $('#txtIndentDate').val(dateValue);
        //    } else {
        //        $('#txtIndentDate').val('');
        //    }
        //    $("#ddlCustomerName").val(selectedIndent.partyId).trigger('change');
        //    $("#ddlVehicleType").val(selectedIndent.vehicleTypeId).trigger('change');
        //    $('#from-search-box').val(selectedIndent.fromLocation);
        //    $('#to-search-box').val(selectedIndent.toLocation);
        //    $('#txtNoOfVehicles').val(selectedIndent.requiredVehicles);
        //    $('#txtVehicleReqOn').val(selectedIndent.vehicleReqOn);

        //    if (dateValue) {
        //        // If it's a Date object, format it
        //        if (dateValue instanceof Date) {
        //            dateValue = dateValue.toISOString().split('T')[0];
        //        } else if (typeof dateValue === "string" && dateValue.includes("T")) {
        //            dateValue = dateValue.split('T')[0];
        //        }
        //        $('#txtVehicleReqOn').val(dateValue);
        //    } else {
        //        $('#txtVehicleReqOn').val('');
        //    }

        //}
    });
    $('#ddlVehicleNo').on('change', function () {
        const selectedValue = $(this).val();
        const selectedVehicle = VehicleList.find(x => x.vehicleId == selectedValue);
        if (selectedVehicle) {
            $("#ddlOwnerName").val(selectedVehicle.ownerVendorId).trigger('change');            
        }
    });
    //GetAllLocation("ddlLocation",companyId); 
    GetAllDriver();
    GetAllVehicleIndent();
    GetAllVehicleNumber();
    FetchPlacementNo();
    GetAllOwnerOrVendor();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);

    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
});
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

//function AutoFetch() {
    
//    var indentNo = $("#ddlIndentNo").val();
//    var getUrl = '/VehiclePlacement/AutoFetchPlacement/' + indentNo;
//    $.ajax({
//        url: getUrl,
//        type: "GET",
//        contentType: "application/json",
//        success: function (response) {
//            console.log(response);
//            $('#txtIndentDate').val(response.indentDate);
//            let dateValue = response.indentDate;
//                if (dateValue) {
//                    // If it's a Date object, format it
//                    if (dateValue instanceof Date) {
//                        dateValue = dateValue.toISOString().split('T')[0];
//                    } else if (typeof dateValue === "string" && dateValue.includes("T")) {
//                        dateValue = dateValue.split('T')[0];
//                    }
//                    $('#txtIndentDate').val(dateValue);
//                } else {
//                    $('#txtIndentDate').val('');
//                }
//            $("#ddlCustomerName").val(response.partyId).trigger('change');
//            $("#ddlVehicleType").val(response.vehicleTypeId).trigger('change');
//            $('#from-search-box').val(response.fromLocation);
//            $('#to-search-box').val(response.toLocation);
//            $('#txtNoOfVehicles').val(response.requiredVehicles);
//            $('#txtVehicleReqOn').val(response.vehicleReqOn);

//                if (dateValue) {
//                    // If it's a Date object, format it
//                    if (dateValue instanceof Date) {
//                        dateValue = dateValue.toISOString().split('T')[0];
//                    } else if (typeof dateValue === "string" && dateValue.includes("T")) {
//                        dateValue = dateValue.split('T')[0];
//                    }
//                    $('#txtVehicleReqOn').val(dateValue);
//                } else {
//                    $('#txtVehicleReqOn').val('');
//                }
//        },
//        error: function (xhr, status, error) {
//            toastr.error("Failed to Fetch Rfq Data!", "Error");
//        }
//    });

//}
function AutoFetch() {
    var indentNo = $("#ddlIndentNo").val();
    var getUrl = '/VehiclePlacement/AutoFetchPlacement/' + indentNo;

    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            console.log(response);

            // Check if response is a non-empty array
            if (Array.isArray(response) && response.length > 0) {
                let data = response[0]; // Use the first object in the array

                // Format indentDate
                let indentDate = data.indentDate;
                if (indentDate) {
                    if (indentDate instanceof Date) {
                        indentDate = indentDate.toISOString().split('T')[0];
                    } else if (typeof indentDate === "string" && indentDate.includes("T")) {
                        indentDate = indentDate.split('T')[0];
                    }
                    $('#txtIndentDate').val(indentDate);
                } else {
                    $('#txtIndentDate').val('');
                }
                
                $("#txtRFQNo").val(data.rfqNo);
                
                $("#ddlCustomerName").val(data.partyId).trigger('change');
                $("#ddlVehicleType").val(data.vehicleTypeId).trigger('change');
                $('#from-search-box').val(data.fromLocation);
                $('#to-search-box').val(data.toLocation);
                $('#txtNoOfVehicles').val(data.requiredVehicles);
                $('#txtIndentBranch').val(data.locationId);
                $('#txtPendingVehicles').val(data.pendingVehicles);

                // Format vehicleReqOn
                let vehicleReqOn = data.vehicleReqOn;
                if (vehicleReqOn) {
                    if (vehicleReqOn instanceof Date) {
                        vehicleReqOn = vehicleReqOn.toISOString().split('T')[0];
                    } else if (typeof vehicleReqOn === "string" && vehicleReqOn.includes("T")) {
                        vehicleReqOn = vehicleReqOn.split('T')[0];
                    }
                    $('#txtVehicleReqOn').val(vehicleReqOn);
                } else {
                    $('#txtVehicleReqOn').val('');
                }

                let rfqDate = data.vehicleReqOn;
                if (rfqDate) {
                    if (rfqDate instanceof Date) {
                        rfqDate = rfqDate.toISOString().split('T')[0];
                    } else if (typeof rfqDate === "string" && rfqDate.includes("T")) {
                        rfqDate = rfqDate.split('T')[0];
                    }
                    $('#txtRFQDate').val(rfqDate);
                } else {
                    $('#txtRFQDate').val('');
                }

            } else {
                toastr.warning("No data found for selected indent number.", "Warning");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch RFQ data!", "Error");
        }
    });
}

        