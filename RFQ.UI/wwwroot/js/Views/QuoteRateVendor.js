var quoteratevendore
$(document).on("click", "#btnViewForm", function () {
    FetchList();
    $("#AddQuoteRoleVendorDiv").css('display', 'none')
    $("#backButton").css('display', 'Block')
});
$(document).ready(function () {
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        if (ValidationCheck()) {
            Save(action);
        }
    });
    Initialization();
    GetAllVehicleType();
    GetAllItemName();
    GetAllPakingType();
    GetAllStateList("ddlOrigin");
    GetAllStateList("ddlDestination");
    GetAllItemName("ddlItemName");
});
function Initialization()
{
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
    $("#btnSaveForm").click(function (event) {
        event.preventDefault();
        Save();
    });
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
function Save(action) {

    //var isvalid = ValidationCheck();
    //if (!isvalid) {
    //    return;
    //}
    //var ExpireOn = $("#txtExpireOn").val();
    //var VehicleReqOn = $("#txtVehicleReqOn").val();
    //var ItemName = $("#ddlItemName").val();
    //var PackingType = $("#ddlPackingType").val();
    //var PANNo = $("#txtPANNo").val();
    //var RFQPriority = $("#txtRFQPriority").val();
    //var NoOfVehicles = $("#txtNoOfVehicles").val();
    //var TotalQTY = $("#txtTotalQTY").val();
    //var Instruction = $("#txtInstruction").val();
    //var RFQNo = $("#txtRFQNo").val();
    //var RFQDate = $("#txtRFQDate").val();
    //var OriginFrom = $("#txtOriginFrom").val();
    //var RFQOn = $("#txtRFQOn").val();
    //var VehicleType = $("#ddlVehicleType").val();
    var DetentionFreeDays = $("#txtDetentionDays").val();
    var DetentionDay = $("#txtDetentionDay").val();
    var VednorName = $("#txtVednorName").val();
    var Destination = $("#txtDestination").val();
    var HireCost = $("#txtHireCost").val();
    var formdata = {
       // RfqDetailId : rfqDetailId,
        VendorId : VednorName,
        LocationId : Destination,
        TotalHireCost : HireCost,
        DetentionPerDay : DetentionDay,
        DetentionFreeDay : DetentionFreeDays
    };
    if (action == "save") {
        $.ajax({
            url: '/RFQRate/SaveQuoteRateVendor/',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(formdata),
            dataType: "json",
            success: function (response) {
                toastr.success(" Details Submitted Successfully!");
                window.location.href = "../Dashboard/Dashboard";
            },
            error: function (req, status, error) {
                toastr.error("Failed to Save User Details", "Error");
            }
        });
    }
    else if (action === "saveNew") {
        try {
            $.ajax({
                url: '/RFQRate/SaveQuoteRateVendor/',
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(formdata),
                dataType: "json",
                success: function (response) {
                    if (response.result == "success") {
                        toastr.success(" Details Submitted Successfully!");
                        $('#userbodyform')[0].reset();
                        $('#ddlCompanyAndFranchise').val(null).trigger('change');
                        $('#ddlLocation').val(null).trigger('change');
                    } else {
                        toastr.error(" already exists", "Error");
                    }
                },
                error: function (req, status, error) {
                    toastr.error("Failed to Save  Details", "Error");
                }
            });


        } catch (error) {
            toastr.error("Failed to Save  Details", "Error");
        }
    }
}
