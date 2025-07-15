var VehicIndentList;
$(document).ready(function () {
    
    //CheckValidation();
    $("#btnSaveType, #btnSaveAndNew").on('click', function () {
        
        var action = $(this).data('action'); // "save" or "saveNew"
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });

    $('#ddlIndent').on('change', function () {
        debugger;
        const selectedValue = $(this).val();

        const selectedIndent = VehicIndentList.find(x => x.indentId == selectedValue);

        if (selectedIndent) {
            $("#ddlCustomerName").selectpicker('val', selectedIndent.partyId);
            $('#ddlCustomerName').selectpicker('refresh');
            $("#ddlVehicleType").selectpicker('val', selectedIndent.vehicleTypeId);
            $('#ddlVehicleType').selectpicker('refresh');
            $('#txtOrigin').val(selectedIndent.fromLocation);
            $('#txtDestination').val(selectedIndent.toLocation);
            $('#txtNoofVehicles').val(selectedIndent.requiredVehicles);
            $('#txtVehicleReqDate').val(selectedIndent.vehicleReqOn);
            let dateValue = selectedIndent.vehicleReqOn;
            if (dateValue) {
                // If it's a Date object, format it
                if (dateValue instanceof Date) {
                    dateValue = dateValue.toISOString().split('T')[0];
                } else if (typeof dateValue === "string" && dateValue.includes("T")) {
                    dateValue = dateValue.split('T')[0];
                }
                $('#txtVehicleReqDate').val(dateValue);
            } else {
                $('#txtVehicleReqDate').val('');
            }
            
        }
    });
    GetAllCustomer();
    GetAllVehicleType();
    GetAllItemName();
    GetAllPakingType();
    GetAllLocation();
    GetAllVehicleIndent();
    FetchRfqNo();
});

function CheckValidation() {
    $("#ddlLocation").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please Select a Location", "Validation Error");
            return;
        }
    });
}
function OnSubmitCheckValidation() {
    debugger;
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Location", "Validation Error");
        return false;
    }
    return true;
}

function GetAllCustomer() {
    var GetUrl = '/Customer/GetDrpCustomerList';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            let customerList = response.filter(x => x.partyTypeId == 6);
            const dropdown = document.getElementById("ddlCustomerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Customer Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            dropdown.appendChild(placeholderOption);
            customerList.forEach(name => {
                const option = document.createElement("option");
                option.value = name.partyId;
                option.textContent = name.partyName;
                dropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Customer Name!", "Error");
        }
    });
}
function GetAllVehicleType() {
    var getVehicleTypeUrl = '/Vehicle/GetAllMasterVehicleType'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const vehicleTypedropdown = document.getElementById("ddlVehicleType");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a VehicleType";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleTypedropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.vehicleTypeId;
                option.textContent = item.vehicleTypeName;
                vehicleTypedropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vehicle Type!", "Error");
        }
    });
}
function GetAllItemName() {
    var getUrl = '/Product/GetDrpProductList';
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const vehicleTypedropdown = document.getElementById("ddlItemName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Item Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleTypedropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.itemId;
                option.textContent = item.itemName;
                vehicleTypedropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Product Type!", "Error");
        }
    });
}
function GetAllPakingType() {
    var getUrl = '/CompanyMasterPackingType/GetAllMasterPackingType';
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const vehicleTypedropdown = document.getElementById("ddlPackingType");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a PakingType";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleTypedropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.packingId;
                option.textContent = item.packingName;
                vehicleTypedropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Paking Type!", "Error");
        }
    });
}
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
function GetAllVehicleIndent() {
    var getVehicleTypeUrl = '/RequestForQuote/GetAllVehicleIndentList'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            response = response.result;
            VehicIndentList = response;
            console.log(response);
            const Indentdropdown = document.getElementById("ddlIndent");
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
function FetchRfqNo() {
    $.ajax({
        url: "/RequestForQuote/GetRfqNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtRfqNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function SaveAndSaveNew(action) {
    var saveUrl = '/RequestForQuote/AddRfq';
    debugger;
    const formData = { 
        RfqNo: $('#txtRfqNo').val(),
        CompanyId: $('#ddlLocation').val(),
        LocationId: $('#ddlLocation').val(),
        IndentId: $('#ddlIndent').val(),
        RfqDate: $('#txtRfqDate').val(),
        ExpiryDate: $('#txtRfqExpiredOn').val(),
        PartyId: $('#ddlCustomerName').val(),
        VehicleReqOn: $('#txtVehicleReqDate').val(),
        FromLocation: $('#txtOrigin').val(),
        //FromLatitude: null,
        //FromLongitude: null,
        ToLocation: $('#txtDestination').val(),
        //ToLatitude: null,
        //ToLongitude: null,
        VehicleRequiredOn: $('#txtVehicleReqDate').val(),
        VehicleTypeId: $('#ddlVehicleType').val(),
        VehicleCount: $('#txtNoofVehicles').val(),
        RfqPriorityId: $('#ddlRfqPriority').val(),
        RfqTypeId: $('#ddlRfqType').val(),
        ItemId: $('#ddlItemName').val(),
        MaxCosting: $('#txtMaxCosting').val(),
        DetentionPerDay: $('#txtPerDay').val(),
        DetentionFreeDays: $('#txtFreeDay').val(),
        PackingTypeId: $('#ddlPackingType').val(),
        SpecialInstruction: $('#txtSpecialInstructions').val(),
        LinkId : GetQueryParam("LinkId"),

        //StatusId: 1,
        //CreatedBy: 1,
        //CreatedOn: new Date().toISOString(),
        //UpdatedBy: null,
        //UpdatedOn: new Date().toISOString()

    };

    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    window.location.href = "../Dashboard/Dashboard";
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Request For Quote.", "Error");
            }
        });
    }

    else if (action === "saveNew") {
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    toastr.success("Vehicle Indent Saved Successfully!", "Success");
                    $('#RfqDetailsForm')[0].reset();
                    $('#ddlLocation').val(null).trigger('change');
                    $('#ddlIndent').val(null).trigger('change');
                    $('#ddlCustomerName').val(null).trigger('change');
                    $('#ddlVehicleType').val(null).trigger('change');
                    $('#ddlRfqPriority').val(null).trigger('change');
                    $('#ddlRfqType').val(null).trigger('change');
                    $('#ddlItemName').val(null).trigger('change');
                    $('#ddlPackingType').val(null).trigger('change');
                    FetchRfqNo();
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Request For Quote.", "Error");
            }
        });
    }





    else if (action === "saveNew") {

    } else {
        console.warn("Unknown action:", action);
    }
}