var quoterolevendore
$(document).on("click", "#btnViewForm", function () {
    FetchList();
    $("#AddQuoteRoleVendorDiv").css('display', 'none')
    $("#backButton").css('display', 'Block')
});
$(document).ready(function () {
    Initialization();
    GetAllVehicleType();
    GetAllItemName();
    GetAllPakingType();
});
function Initialization() {
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
    if (IsNullOrEmpty($("#txtRFQNo").val())) {
        toastr.warning("Please enter a valid RFQ No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRFQDate").val())) {
        toastr.warning("Please enter a valid RFQ Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVednorName").val())) {
        toastr.warning("Please enter a valid Vendor Name", "Validation Error");
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
    if (IsNullOrEmpty($("#txtRFQOn").val())) {
        toastr.warning("Please enter a valid RFQ On", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVehicleType").val())) {
        toastr.warning("Please enter a valid Vehicle Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtHireCost").val())) {
        toastr.warning("Please enter a valid Hire Cost", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDetentionDay").val())) {
        toastr.warning("Please enter a valid Detention Per Day", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtExpireOn").val())) {
        toastr.warning("Please enter a valid Expire On", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVehicleReqOn").val())) {
        toastr.warning("Please enter a valid Vehicle Req On", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtItemName").val())) {
        toastr.warning("Please enter a valid Item Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPackingType").val())) {
        toastr.warning("Please enter a valid Packing Type", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPANNo").val())) {
        toastr.warning("Please enter a valid PAN No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRFQPriority").val())) {
        toastr.warning("Please enter a valid RFQ Priority", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtNoOfVehicles").val())) {
        toastr.warning("Please enter a valid No Of Vehicles", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTotalQTY").val())) {
        toastr.warning("Please enter a valid Total QTY", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDetentionDays").val())) {
        toastr.warning("Please enter a valid Detention Free Days", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtInstruction").val())) {
        toastr.warning("Please enter a valid Instruction", "Validation Error");
        return false;
    }
}
function GetAllVehicleType() {
    debugger;
    var getVehicleTypeUrl = '/Vehicle/GetAllMasterVehicleType'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            debugger;
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
    var getUrl = '/Product/GetAllProducts';
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
function Save() {

    var isvalid = ValidationCheck();
    if (!isvalid) {
        return;
    }
}
