$(document).ready(function () {
    CheckValidation();
    $("#btnSaveForm, #btnSaveAndNew").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        //if (OnSubmitValidation()) {
            SaveAndSaveNew(action);
        //}
    });
    GetAllCustomer();
    GetAllVehicleType();
    GetAllItemName();
    GetAllPakingType();
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
function OnSubmitValidation() {
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
function Save() {

    var isvalid = OnSubmitValidation();
    if (!isvalid) {
        return;
    }
}

function collectRfqFormData() {
    // Collect parent data
    const rfq = {
        CompanyId: 1, // Set from session or hidden field
        RfqCategoryId: 1, // Set as needed
        CustomerId: $("#ddlCustomerName").val(),
        RfqNoPrefix: "RFQ",
        RfqNo: $("#txtRfqNo").val(),
        RfqDate: $("#txtRfqDate").val(),
        RfqSubject: $("#txtRfqSubject").val(),
        RfqExpiresOn: $("#txtRfqExpiredOn").val(),
        RfqTypeId: $("#ddlRfqType").val(),
        VehicleReqOn: $("#txtVehicleReqDate").val(),
        RfqPriorityId: $("#ddlRfqPriority").val(),
        Remarks: $("#txtSpecialInstructions").val(),
        LinkId: 0,
        StatusId: 1,
        CreatedBy: 1, // Set from session
        CreatedOn: new Date().toISOString(),
        UpdatedBy: null,
        UpdatedOn: null
    };

    // Collect child data (example for one row, loop for multiple)
    const rfqDetails = [{
        FromLoc: $("#txtOrigin").val(),
        FromLocLat: "", // Set as needed
        FromLocLong: "",
        ToLoc: $("#txtDestination").val(),
        ToLocLat: "",
        ToLocLong: "",
        RfqOnId: $("#ddlRfqOn").val(),
        VehicleTypeId: $("#ddlVehicleType").val(),
        VehicleCount: $("#txtNoofVehicles").val(),
        TotalQty: $("#txtTotalQty").val(),
        ItemId: $("#ddlItemName").val(),
        MaxCosting: $("#txtMaxCosting").val(),
        DetentionPerDay: $("#txtDetentionPerDay").val(),
        DetentionFreeDays: $("#txtDetentionFreeDays").val(),
        PackingTypeId: $("#ddlPackingType").val(),
        SpecialInstruction: $("#txtSpecialInstructions").val()
    }];

    return { Rfq: rfq, RfqDetails: rfqDetails };
}
function SaveAndSaveNew(action) {
    console.log("Action received:", action);
    debugger;
    if (action === "save") {
        const data = collectRfqFormData();
        $.ajax({
            url: "/RFQVendor/InsertRfqVendor", // Matches [HttpPost("InsertRfq")] in controller
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                if (response.result === "success") {
                    toastr.success("RFQ saved successfully. RFQ ID: " + response.rfqId);
                    // Optionally reset the form or redirect
                } else {
                    toastr.error("Failed to save RFQ: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                toastr.error("An error occurred while saving RFQ.");
                console.error(xhr.responseText);
            }
        });
    } else if (action === "savenew") {

    } else {
        console.warn("Unknown action:", action);
    }
}


