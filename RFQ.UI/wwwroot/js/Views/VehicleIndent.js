var companyId;
var profileId;
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    CheckValidation();
    $("#btnSave, #btnsaveandnew").on('click', function () {
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveVehicleIndent(action);
        }
    });
    GetAllLocation("ddlLocation", companyId);
    FetchIndentNo();
    GetAllStateList("ddlOrigin");
    GetAllStateList("ddlDestination");
    GetAllCustomer("ddlCustomerName",companyId);
    GetAllVehicleType("ddlVehicleType",companyId);            
    GetAllItemName("ddlItemName", companyId );
    GetAllPakingType("ddlPackingType");
    if (profileId == EnumProfile.Branch) {
        $("#ddlLocation").val()
    }
});
function CheckValidation() {
    $("#ddlLocation").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please Select a Location", "Validation Error");
            return;
        }
    });
    $("#txtIndentNo").on("blur", function () {
        if (!IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a Indent No", "Validation Error");
            return;
        }
    });
    $("#txtIndentDate").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a Indent Date", "Validation Error");
            return;
        }
    });
    $("#txtVehicleReqDate").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a Vehicle Req On", "Validation Error");
            return;
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
    if (IsNullOrEmpty($("#txtConsignor").val())) {
        toastr.warning("Please enter a Consignor", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPickupAddress").val())) {
        toastr.warning("Please enter a Pickup Address", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtConsignee").val())) {
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
        ConsignerName: $('#txtConsignor').val(),
        ConsigneeName: $('#txtConsignee').val(),
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

