var companyId;
var profileId;
var locationId;
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    CheckValidation();
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    FetchIndentNo();
    GetAllStateList("ddlOrigin");
    GetAllStateList("ddlDestination");
    GetAllVehicleType("ddlVehicleType", companyId);
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllItemName("ddlItemName", companyId);
    GetAllConsignorList();
    GetAllConsigneeList();
    GetAllPakingType("ddlPackingType");

    $("#btnSave, #btnsaveandnew").on('click', function () {
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveVehicleIndent(action);
        }
    });
});
function GetAllConsignorList() {
    var getUrl = '/Vendor/GetAllVendorList'
    $.ajax({
        url: getUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            const consignorListDropdown = document.getElementById("ddlConsignorInput");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select or Add a Consignor Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            consignorListDropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                consignorListDropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Consignor Name!", "Error");
            $("#ddlLocation").val()
        }

    });
};
function GetAllConsigneeList() {
    $.ajax({
        url: '/Customer/GetDrpCustomerList',
        type: "GET",
        data: { companyId: companyId },
        dataType: "json",
        success: function (response) {
            const selectConsignee = document.getElementById("ddlConsigneeInput");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select or Add a Consignee Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectConsignee.appendChild(placeholderOption);
            response.forEach(name => {
                const option = document.createElement("option");
                option.value = name.partyId;
                option.textContent = name.partyName;
                selectConsignee.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Consignee Name!", "Error");
        }
    });
}
function CheckValidation() {
    $("#txtVehicleReqDate").on("change", function () {
        if ($(this).val() <= $('#txtIndentDate').val()) {
            toastr.warning("Vehicle Req On date must be greater than Indent Date.", "Warning");
            $(this).val('');
        }
    });
    $("#txtRfqExpiredOn").on("change", function () {
        var expireDate = $(this).val().split('T')[0];
        if (expireDate <= $('#txtVehicleReqDate').val()) {
            toastr.warning("Indent Expired On date must be greater than Vehicle Req On Date.", "Warning");
            $(this).val('');
        }
    });
}
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Location", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtIndentNo").val())) {
        toastr.warning("Please enter a Indent No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtIndentDate").val())) {
        toastr.warning("Please enter a Indent Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVehicleReqDate").val())) {
        toastr.warning("Please enter a Vehicle Req On", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlCustomerName").val())) {
        toastr.warning("Please Select a Customer Name", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlOrigin").val())) {
        toastr.warning("Please enter a Origin/From", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlDestination").val())) {
        toastr.warning("Please enter a Destination/To", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlVehicleType").val())) {
        toastr.warning("Please Select a Vehicle Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtNoofVehicles").val())) {
        toastr.warning("Please enter a No. of Vehicles Req", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRfqExpiredOn").val())) {
        toastr.warning("Please enter a Indent Expired On", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlConsignorInput").val())) {
        toastr.warning("Please enter a Consignor", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPickupAddress").val())) {
        toastr.warning("Please enter a Pickup Address", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlConsigneeInput").val())) {
        toastr.warning("Please enter a Consignee", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDeliveryAddress").val())) {
        toastr.warning("Please enter a Delivery Address", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlItemName").val())) {
        toastr.warning("Please Select a Item Name", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlPackingType").val())) {
        toastr.warning("Please Select a Packing Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRemarks").val())) {
        toastr.warning("Please enter a Remarks", "Validation Error");
        return false;
    }
    return true;
}
function SaveVehicleIndent(action) {
    var saveUrl = '/VehicleIndent/AddVehicleIndent';
    var consignorResult = GetDropdownValue("ddlConsignorInput");
    var consigneeResult = GetDropdownValue("ddlConsignorInput");
    const formData = {
        IndentNo: $('#txtIndentNo').val(),
        LocationId: $('#ddlLocation').val(),
        IndentDate: $('#txtIndentDate').val(),
        VehicleReqOn: $('#txtVehicleReqDate').val(),
        PartyId: $('#ddlCustomerName').val(),
        FromLocation: $('#ddlOrigin').val(),
        ToLocation: $('#ddlDestination').val(),
        VehicleTypeId: $('#ddlVehicleType').val(),
        RequiredVehicles: $('#txtNoofVehicles').val(),
        ExpiryDate: $('#txtRfqExpiredOn').val(),
        ConsignerId: consignorResult.id,
        ConsignerName: consignorResult.name,
        ConsigneeId: consigneeResult.id,
        ConsigneeName: consigneeResult.name,
        PickUpAddress: $('#txtPickupAddress').val(),
        DeliveryAddress: $('#txtDeliveryAddress').val(),
        ItemId: $('#ddlItemName').val(),
        PackingTypeId: $('#ddlPackingType').val(),
        Remarks: $('#txtRemarks').val(),
        LinkId: GetQueryParam("LinkId")
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
                    toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
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
                    $('#vehicleIndentForm')[0].reset();
                    $('#ddlLocation').val(null).trigger('change');
                    $('#ddlCustomerName').val(null).trigger('change');
                    $('#ddlVehicleType').val(null).trigger('change');
                    $('#ddlItemName').val(null).trigger('change');
                    $('#ddlPackingType').val(null).trigger('change');
                    FetchIndentNo();
                } else {
                    toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
            }
        });
    }

}
function FetchIndentNo() {
    $.ajax({
        url: "/VehicleIndent/GetIndentNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtIndentNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function GetDropdownValue(inputId) {
    const selectedValue = $("#" + inputId).val();
    const selectedText = $("#" + inputId).find("option:selected").text();
    let result;
    if (selectedValue === selectedText) {
        result = {
            id: 0,
            name: selectedValue
        };
    } else {
        result = {
            id: selectedValue,
            name: selectedText
        };
    }
    return result;
}