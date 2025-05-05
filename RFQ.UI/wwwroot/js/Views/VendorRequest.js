$(document).ready(function () {

    CheckValidation();
    $("#btnSaveRfqVendor, #btnSavenewRfqVendor").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }

    });
});
function CheckValidation() {
    $("#ddlCustomerName").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Customer Name", "Validation Error");
            return;
        }
    });

    $("#txtRfqSubject").on("blur", function () {
        if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
            toastr.warning("Please enter a valid Rfq Subject", "Validation Error");
            return;
        }
    });

    $("#ddlRfqType").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Rfq Type", "Validation Error");
            return;
        }
    });

    $("#ddlRfqPriority").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Rfq Property", "Validation Error");
            return;
        }
    });

    $("#ddlRfqOn").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Rfq On", "Validation Error");
            return;
        }
    });

    $("#ddlVehicleType").on("blur", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please select a Vehicle Type", "Validation Error");
            return;
        }
    });

    $("#txtNoofVehicles").on("blur", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please Enter a No of Vehicels", "Validation Error");
            return;
        }
    });

    $("#txtTotalQty").on("blur", function () {
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

    $("#txtSpecialInstructions").on("blur", function () {
        if (!/^[A-Za-z0-9 ]+$/.test($(this).val())) {
            toastr.warning("Please enter a valid Special Instructions", "Validation Error");
            return;
        }
    });

    $("#txtMaxCosting").on("blur", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please Enter a Total Max Costing", "Validation Error");
            return;
        }
    });

    $("#txtDetentionPerDay").on("blur", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please Enter a Detention Per Day", "Validation Error");
            return;
        }
    });

    $("#txtDetentionFreeDays").on("blur", function () {
        if (!isNumeric($(this).val())) {
            toastr.warning("Please Enter a Detention Free Days", "Validation Error");
            return;
        }
    });

}
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlCustomerName").val())) {
        toastr.warning("Please Select a Customer Name", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtRfqSubject").val()) || !/^[A-Za-z0-9 ]+$/.test($("#txtRfqSubject").val())) {
        toastr.warning("Please enter a valid Rfq Subject", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlRfqType").val())) {
        toastr.warning("Please select a Rfq Type", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlRfqPriority").val())) {
        toastr.warning("Please select a Rfq Property", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlRfqOn").val())) {
        toastr.warning("Please select a Rfq On", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlVehicleType").val())) {
        toastr.warning("Please select a Rfq Vehicle Type", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtNoofVehicles").val()) || !isNumeric($("#txtNoofVehicles").val())) {
        toastr.warning("Please enter a No of Vehicles", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtTotalQty").val()) || !isNumeric($("#txtTotalQty").val())) {
        toastr.warning("Please Enter a Total Qty in Tons", "Validation Error");
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

    if (IsNullOrEmpty($("#txtSpecialInstructions").val()) || !/^[A-Za-z0-9 ]+$/.test($("#txtSpecialInstructions").val())) {
        toastr.warning("Please enter a valid Special Instructions", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtMaxCosting").val()) || !isNumeric($("#txtMaxCosting").val())) {
        toastr.warning("Please Enter a Total Max Costing", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDetentionPerDay").val()) || !isNumeric($("#txtDetentionPerDay").val())) {
        toastr.warning("Please Enter a Detention Per Day", "Validation Error");
        return false;
    }

    if (IsNullOrEmpty($("#txtDetentionFreeDays").val()) || !isNumeric($("#txtDetentionFreeDays").val())) {
        toastr.warning("Please Enter a Detention Free Days", "Validation Error");
        return false;
    }

}

