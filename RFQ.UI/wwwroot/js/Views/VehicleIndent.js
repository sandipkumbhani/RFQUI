$(document).ready(function () {
    //CheckValidation();
    $("#btnSave, #btnSaveAndNew").on('click', function () {
        var action = $(this).data('action'); 
        debugger;
        //if (OnSubmitCheckValidation()) {
        SaveVehicleIndent(action);
        //}
    });
    GetAllCustomer();
    GetAllVehicleType();
    GetAllItemName();
    GetAllPakingType();
    GetAllLocation();
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

function SaveVehicleIndent(action) {
    //if (OnSubmitValidation()) {
    var saveUrl = '/VehicleIndent/AddVehicleIndent';
    const formData = {
        IndentNo: $('#txtRfqNo').val(), 
        BranchId: $('#ddlLocation').val(),
        CorporateId: null,
        IndentDate: $('#txtIndentDate').val(),
        VehicleRequiredOn: $('#txtVehicleReqDate').val(),
        CustomerId: $('#ddlCustomerName').val(),
        FromLocation: $('#txtOrigin').val(),
        FromLatitude: null,
        FromLongitude: null,
        ToLocation: $('#txtDestination').val(),
        ToLatitude: null,
        ToLongitude: null,
        VehicleTypeId: $('#ddlVehicleType').val(),
        ItemId: $('#ddlItemName').val(),
        PackingTypeId: $('#ddlPackingType').val(),
        ExpiryDate: $('#txtRfqExpiredOn').val(),
        Consignor: $('#txtConsignor').val(),
        Consignee: $('#txtConsignee').val(),
        StatusId: 1,
        CreatedBy: 1, 
        CreatedOn: new Date().toISOString(),
        UpdatedBy: null,
        UpdatedOn: null
    };

    if (action === "save") {

        $.ajax({
            url: '/VehicleIndent/AddVehicleIndent',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    alert("Vehicle Indent saved successfully!");
                    if ($(e.currentTarget).attr('id') === 'btnsaveandnew') {
                        $('#vehicleIndentForm')[0].reset(); // reset form if "Save & New"
                    }
                } else {
                    alert("Something went wrong while saving.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", xhr.responseText);
                alert("Error occurred while saving vehicle indent.");
            }
        });
    } else if (action === "saveNew") {
        $.ajax({
            url: '/VehicleIndent/AddVehicleIndent',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    alert("Vehicle Indent saved successfully!");
                    if ($(e.currentTarget).attr('id') === 'btnsaveandnew') {
                        $('#vehicleIndentForm')[0].reset(); // reset form if "Save & New"
                    }
                } else {
                    alert("Something went wrong while saving.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", xhr.responseText);
                alert("Error occurred while saving vehicle indent.");
            }
        });
    }
}
