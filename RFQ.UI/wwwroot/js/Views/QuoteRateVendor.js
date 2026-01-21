var quoteratevendore;

$(document).on("click", "#btnViewForm", function () {
    $("#AddQuoteRoleVendorDiv").css('display', 'none')
    $("#backButton").css('display', 'Block')
});

$(document).ready(function () {
    $("#btnSaveForm").on('click', function () {
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            Save(action);
        }
    });
    $("#txtAvailableVehicle").on("blur", function () {
        const value = $(this).val();
        const numberOfVehicle = $("#txtNoOfVehicles").val();
        if (!IsNullOrEmpty(value)) {
            if (parseInt(value) > parseInt(numberOfVehicle)) {
                toastr.warning("Available Vehicle Count Not greater than Required Vehicles", "Validation");
                $("#txtAvailableVehicle").val(null);
            }
        }
       
    });
    UrlParamBind()
});
function OnSubmitCheckValidation() {
    if (IsNullOrEmpty($("#txtAvailableVehicle").val())) {
        toastr.warning("Please enter a Vehicle Count", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtHireCost").val())) {
        toastr.warning("Please enter a Total Hire Cost", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDetentionDay").val())) {
        toastr.warning("Please enter Detention Per Day", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDetentionDays").val())) {
        toastr.warning("Please enter a Detention Free Days", "Validation Error");
        return false;
    }
    return true;

}

//function Initialization() {
//    $("#txtRFQDate").on("blur", function () {
//        if (!isValidateSelect($(this).val())) {
//            toastr.warning("Please select a Rfq Date", "Validation Error");
//            return;
//        }
//    });
//    $("#txtExpireOn").on("blur", function () {
//        if (!isValidateSelect($(this).val())) {
//            toastr.warning("Please select a Rfq ExpireOn", "Validation Error");
//            return;
//        }
//    });
//    $("#txtVehicleReqOn").on("blur", function () {
//        if (!isValidateSelect($(this).val())) {
//            toastr.warning("Please select a Vehicle Req On", "Validation Error");
//            return;
//        }
//    });
   


//    //$("#ddlRFQPriority").on("blur", function () {
//    //    if (!isValidateSelect($(this).val())) {
//    //        toastr.warning("Please select a Rfq Priority", "Validation Error");
//    //        return;
//    //    }
//    //});
//    //$("#txtVednorName").on("blur", function () {
//    //    if (!isValidateSelect($(this).val())) {
//    //        toastr.warning("Please select a Vednor Name", "Validation Error");
//    //        return;
//    //    }
//    //});
//    $("#txtOriginFrom").on("blur", function () {
//        if (!isValidateSelect($(this).val())) {
//            toastr.warning("Please select a Origin From", "Validation Error");
//            return;
//        }
//    });
//    $("#txtDestination").on("blur", function () {
//        if (!isValidateSelect($(this).val())) {
//            toastr.warning("Please select aDestination", "Validation Error");
//            return;
//        }
//    });
//    $("#txtRFQOn").on("blur", function () {
//        if (!isValidateSelect($(this).val())) {
//            toastr.warning("Please select a Rfq ON", "Validation Error");
//            return;
//        }
//    });
//    $("#ddlVehicleType").on("blur", function () {
//        if (!isValidateSelect($(this).val())) {
//            toastr.warning("Please select a Vehicle Type", "Validation Error");
//            return;
//        }
//    });

//    $("#txtNoOfVehicles").on("blur", function () {
//        if (!isNumeric($(this).val())) {
//            toastr.warning("Please Enter a No of Vehicels", "Validation Error");
//            return;
//        }
//    });

//    $("#txtTotalQTY").on("blur", function () {
//        if (!isNumeric($(this).val())) {
//            toastr.warning("Please Enter a Total Qty in Tons", "Validation Error");
//            return;
//        }
//    });

//    //$("#ddlItemName").on("blur", function () {
//    //    if (!isValidateSelect($(this).val())) {
//    //        toastr.warning("Please select a Item Name", "Validation Error");
//    //        return;
//    //    }
//    //});

//    //$("#ddlPackingType").on("blur", function () {
//    //    if (!isValidateSelect($(this).val())) {
//    //        toastr.warning("Please select a Paking Type", "Validation Error");
//    //        return;
//    //    }
//    //});
//    $("#txtHireCost").on("blur", function () {
//        var hirecost = $(this).val();
//        if (IsNullOrEmpty(hirecost)) {
//            toastr.warning("Please enter a valid Hire Cost", "Warning");
//            return;
//        }
//    });
//    $("#txtDetentionDay").on("blur", function () {
//        var detentionDay = $(this).val();
//        if (IsNullOrEmpty(detentionDay)) {
//            $("#txtInstruction").val('');
//            toastr.warning("Please enter a Valid Detention Per Day", "Warning");
//            return;
//        }
//    });

//    $("#txtDetentionDays").on("blur", function () {
//        var detentionDays = $(this).val();
//        if (IsNullOrEmpty(detentionDays)) {
//            toastr.warning("Please enter a valid Detention Free Days ", "Warning");
//            return;
//        }
//    });
//    $("#txtInstruction").on("blur", function () {
//        var instruction = $(this).val();
//        if (IsNullOrEmpty(instruction)) {
//            $("#txtInstruction").val('');
//            toastr.warning("Please enter a Special Intruction", "Warning");
//            return;
//        }
//    });
//    //on form submit
//    //$("#btnSaveForm").click(function (event) {
//    //    event.preventDefault();
//    //    Save();
//    //});
//}
function ValidationCheck() {

    if (IsNullOrEmpty($("#txtRFQDate").val())) {
        toastr.warning("Please enter a valid RFQ Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtExpireOn").val())) {
        toastr.warning("Please enter a valid RFQ ExpireOn", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVehicleReqOn").val())) {
        toastr.warning("Please enter a valid Vehicle Req On", "Validation Error");
        return false;
    }
   
    if (!isValidateSelect($("#ddlRFQPriority").val())) {
        toastr.warning("Please select a Rfq Priority", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtOriginFrom").val())) {
        toastr.warning("Please enter a valid Origin", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDestination").val())) {
        toastr.warning("Please enter a valid Destination", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#txtRFQOn").val())) {
        toastr.warning("Please select a Rfq On", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlVehicleType").val())) {
        toastr.warning("Please select a Rfq Vehicle Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtNoOfVehicles").val()) || !isNumeric($("#txtNoOfVehicles").val())) {
        toastr.warning("Please enter a No of Vehicles", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTotalQTY").val()) || !isNumeric($("#txtTotalQTY").val())) {
        toastr.warning("Please Enter a Total Qty in Tons", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtHireCost").val()) || !isNumeric($("#txtHireCost").val())) {
        toastr.warning("Please enter a No of Hire Cost", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDetentionDay").val()) || !isNumeric($("#txtDetentionDay").val())) {
        toastr.warning("Please Enter a Detention Per Day", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDetentionDays").val()) || !isNumeric($("#txtDetentionDays").val())) {
        toastr.warning("Please Enter a Detention Free Days", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtInstruction").val())) {
        toastr.warning("Please enter a valid Instruction", "Validation Error");
        return false;
    }
    return true;
}
function Save(action) {
    var DetentionFreeDays = $("#txtDetentionDays").val();
    var DetentionDay = $("#txtDetentionDay").val();
    var HireCost = $("#txtHireCost").val();
    var availVehicleCount = $("#txtAvailableVehicle").val();
    var RfqId = $("#RfqId").val();
    var vendorId = $("#vendorId").val();
    var formdata = {
        rfqRateId: 0,
        rfqId: parseInt(RfqId),
        vendorId: parseInt(vendorId),
        AvailVehicleCount: parseInt(availVehicleCount),
        totalHireCost: parseInt(HireCost),
        detentionPerDay: parseInt(DetentionDay),
        detentionFreeDays: parseInt(DetentionFreeDays)
    };

    if (action === "save") {
        $.ajax({
            url: '/QuoteRateVendor/SaveQuoteRateVendor',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(formdata),
            dataType: "json",
            success: function (response) {
                if (response) {
                    $('#successCard').removeClass('d-none');;
                    $('#formDiv').addClass('d-none');
                    //toastr.success("Vehicle Indent Saved Successfully!", "Success");
                    $('#QRVendorBodyForm')[0].reset();
                    UrlParamBind();
                } else {
                    toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
                }
            }
        });
    }

}
function UrlParamBind() {
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
    }
    console.log(urlParams);
    const VendorId = urlParams.get("VendorId");
    const RfqId = urlParams.get("RfqId");
    $("#vendorId").val(VendorId);
    $("#RfqId").val(RfqId);
    getRfqQuoteRateVendorDetails(RfqId, VendorId);
}
function getRfqQuoteRateVendorDetails(RfqId, VendorId) {
    var Body = {
        RfqId: RfqId,
        VendorId: VendorId
    }
    $.ajax({
        url: '/QuoteRateVendor/GetRfqQuoteRateVendorDetailsqById',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(Body),
        success: function (response) {
            if (response.statusCode == 200) {
                var data = response.data;
                console.log(response);
                $("#RfqId").val(data.rfqId);
                $("#RfqId").val(data.rfqId);
                $("#txtRFQNo").val(data.rfqNo);
                $("#txtExpireOn").val(formatDate(data.expiryDate));
                $("#ddlOrigin").val(data.fromLocation);
                $("#ddlDestination").val(data.toLocation);
                $("#ddlVehicleType").val(data.vehicleTypeName);
                $("#txtNoOfVehicles").val(data.vehicleCount);
                $("#txtRFQDate").val(formatDate(data.rfqDate).substring(0, 11));
                $("#txtVehicleReqOn").val(formatDate(data.vehicleReqOn).substring(0, 11));
                //$("#txtVednorName").val(partyName);
                //$("#txtPANNo").val(panNo);
                //$("#vendorId").val(VendorId);
                //$("#ddlItemName").val(ItemName);
                //$("#ddlPackingType").val(PackingTypeName);
                //$("#txtInstruction").val(specialInstruction);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Get GstEkyc-Detail", "Error");
            ClearGstFields();
        }
    });
}