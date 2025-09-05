var quoteratevendore
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
    UrlParamBind()
    //Initialization();
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
function Initialization() {
    $("#txtRFQDate").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Rfq Date", "Validation Error");
            return;
        }
    });
    $("#txtExpireOn").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Rfq ExpireOn", "Validation Error");
            return;
        }
    });
    $("#txtVehicleReqOn").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Vehicle Req On", "Validation Error");
            return;
        }
    });

    $("#txtPANNo").on("blur", function () {
        if (!ValidatePanNumber($(this).val())) {
            toastr.warning("Please enter a valid PAN No", "Validation Error");
            return;
        }
    });
    $("#ddlRFQPriority").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Rfq Priority", "Validation Error");
            return;
        }
    });
    $("#txtVednorName").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Vednor Name", "Validation Error");
            return;
        }
    });
    $("#txtOriginFrom").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Origin From", "Validation Error");
            return;
        }
    });
    $("#txtDestination").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select aDestination", "Validation Error");
            return;
        }
    });
    $("#txtRFQOn").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Rfq ON", "Validation Error");
            return;
        }
    });
    $("#ddlVehicleType").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Vehicle Type", "Validation Error");
            return;
        }
    });

    $("#txtNoOfVehicles").on("blur", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please Enter a No of Vehicels", "Validation Error");
            return;
        }
    });

    $("#txtTotalQTY").on("blur", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please Enter a Total Qty in Tons", "Validation Error");
            return;
        }
    });

    $("#ddlItemName").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Item Name", "Validation Error");
            return;
        }
    });

    $("#ddlPackingType").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Paking Type", "Validation Error");
            return;
        }
    });
    $("#txtHireCost").on("blur", function () {
        var hirecost = $(this).val();
        if (IsNullOrEmpty(hirecost)) {
            toastr.warning("Please enter a valid Hire Cost", "Warning");
            return;
        }
    });
    $("#txtDetentionDay").on("blur", function () {
        var detentionDay = $(this).val();
        if (IsNullOrEmpty(detentionDay)) {
            $("#txtInstruction").val('');
            toastr.warning("Please enter a Valid Detention Per Day", "Warning");
            return;
        }
    });

    $("#txtDetentionDays").on("blur", function () {
        var detentionDays = $(this).val();
        if (IsNullOrEmpty(detentionDays)) {
            toastr.warning("Please enter a valid Detention Free Days ", "Warning");
            return;
        }
    });
    $("#txtInstruction").on("blur", function () {
        var instruction = $(this).val();
        if (IsNullOrEmpty(instruction)) {
            $("#txtInstruction").val('');
            toastr.warning("Please enter a Special Intruction", "Warning");
            return;
        }
    });
    //on form submit
    //$("#btnSaveForm").click(function (event) {
    //    event.preventDefault();
    //    Save();
    //});
}
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
    if (IsNullOrEmpty($("#txtVednorName").val())) {
        toastr.warning("Please Select a Vendor Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPANNo").val()) || !ValidatePanNumber($("#txtPANNo").val())) {
        toastr.warning("Please enter a valid PAN No", "Validation Error");
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
    if (!isValidateSelect($("#ddlItemName").val())) {
        toastr.warning("Please select a Item Name", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlPackingType").val())) {
        toastr.warning("Please select a Paking Type", "Validation Error");
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

    const rfqNo = urlParams.get("RfqNo");
    const rfqDate = urlParams.get("RfqDate");
    const expiryDate = urlParams.get("ExpiryDate");
    const PartyName = urlParams.get("PartyName");
    const vehicleReqOn = urlParams.get("VehicleReqOn");
    const fromLocation = urlParams.get("FromLocation");
    const toLocation = urlParams.get("ToLocation");
    const vehicleTypeId = urlParams.get("VehicleTypeId");
    const VehicleTypeName = urlParams.get("VehicleTypeName");
    const vehicleCount = urlParams.get("VehicleCount");
    const ItemName = urlParams.get("ItemName");
    const PackingTypeName = urlParams.get("PackingTypeName");
    const specialInstruction = urlParams.get("SpecialInstruction");
    const VendorId = urlParams.get("VendorId");
    const RFQId = urlParams.get("RfqId");
    const PanNo = urlParams.get("PANNo");

    $("#RfqId").val(RFQId);
    $("#vendorId").val(VendorId);
    $("#txtRFQNo").val(rfqNo);
    $("#txtExpireOn").val(formatDate(expiryDate));
    $("#txtVednorName").val(PartyName);
    $("#txtPANNo").val(PanNo);
    $("#ddlOrigin").val(fromLocation);
    $("#ddlDestination").val(toLocation);
    $("#ddlVehicleType").val(VehicleTypeName);
    $("#txtNoOfVehicles").val(vehicleCount);
    $("#ddlItemName").val(ItemName);
    $("#ddlPackingType").val(PackingTypeName);
    $("#txtInstruction").val(specialInstruction);
    $("#txtRFQDate").val(formatDate(rfqDate).substring(0, 11));
    $("#txtVehicleReqOn").val(formatDate(vehicleReqOn).substring(0, 11));
}

