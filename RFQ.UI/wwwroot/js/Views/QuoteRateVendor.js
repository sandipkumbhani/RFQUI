var quoteratevendore
var companyId;
var vendorId;
var rfqId = '';
$(document).on("click", "#btnViewForm", function () {

    //RfqRateId: $('#rfqrateId').val(),
    //RfqNo: $('#txtRFQNo').val(),
    //RfqDate: $('#txtRFQDate').val(),
    //ExpireOn: $('#txtExpireOn').val(),
    //VehicleReqOn: $('#txtVehicleReqOn').val(),
    //VendorName: $('#txtVednorName').val(),
    //PanNo: $('#txtPANNo').val(),
    //OriginId: $('#ddlOrigin').val(),
    //DestinationId: $('#ddlDestination').val(),
    //VehicleTypeId: $('#ddlVehicleType').val(),
    //NoOfVehicles: $('#txtNoOfVehicles').val(),
    //ItemNameId: $('#ddlItemName').val(),
    //PackingTypeId: $('#ddlPackingType').val(),
    //SpecialInstructions: $('#txtInstruction').val(),
    //TotalHireCost: $('#txtHireCost').val(),
    //DetentionPerDay: $('#txtDetentionDay').val(),
    //DetentionFreeDays: $('#txtDetentionDays').val()

    $("#AddQuoteRoleVendorDiv").css('display', 'none')
    $("#backButton").css('display', 'Block')
});
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        //if (ValidationCheck()) {
        Save(action);
        //}
    });
    Initialization();
    GetAllVehicleType("ddlVehicleType", companyId);
    GetAllPakingType("ddlPackingType");
    GetAllItemName("ddlItemName", companyId);
    GetAllVendorList()
    setTimeout(() => {
        UrlParamBind()
    }, 100);
});
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
    debugger;
    var DetentionFreeDays = $("#txtDetentionDays").val();
    var DetentionDay = $("#txtDetentionDay").val();
    var VednorName = $("#txtVednorName").val();
    var HireCost = $("#txtHireCost").val();

    var formdata = {
        rfqRateId: 0,
        rfqId: parseInt(VednorName),
        vendorId: parseInt(rfqId),
        totalHireCost: parseInt(HireCost),
        detentionPerDay: parseInt(DetentionDay),
        detentionFreeDays: parseInt(DetentionFreeDays)
    };
    debugger;
    $.ajax({
        url: '/QuoteRateVendor/SaveQuoteRateVendor',
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

function UrlParamBind() {
    debugger;
    const urlParams = new URLSearchParams(window.location.search);
    const RFQId = urlParams.get("RfqId");
    const rfqNo = urlParams.get("RfqNo");
    const rfqDate = urlParams.get("RfqDate");
    const expiryDate = urlParams.get("ExpiryDate");
    const partyId = urlParams.get("PartyId");
    const vehicleReqOn = urlParams.get("VehicleReqOn");
    const fromLocation = urlParams.get("FromLocation");
    const toLocation = urlParams.get("ToLocation");
    const vehicleTypeId = urlParams.get("VehicleTypeId");
    const vehicleCount = urlParams.get("VehicleCount");
    const itemId = urlParams.get("ItemId");
    const packingTypeId = urlParams.get("PackingTypeId");
    const specialInstruction = urlParams.get("SpecialInstruction");
    var VendorId = urlParams.get("VendorId");
    const PanNo = urlParams.get("PanNo");
    debugger;
    vendorId = VendorId;
    rfqId = RFQId;
    $("#txtRFQNo").val(rfqNo);
    $("#txtExpireOn").val(formatDate(expiryDate));
    $("#txtVednorName").val(parseInt(VendorId)).trigger('change');;
    $("#txtPANNo").val(PanNo);
    $("#ddlOrigin").val(fromLocation);
    $("#ddlDestination").val(toLocation);
    $("#ddlVehicleType").val(parseInt(vehicleTypeId)).trigger('change');
    $("#txtNoOfVehicles").val(vehicleCount);
    $("#ddlItemName").val(parseInt(itemId)).trigger('change');
    $("#ddlPackingType").val(parseInt(packingTypeId)).trigger('change');
    $("#txtInstruction").val(specialInstruction);
    $("#txtRFQDate").val(formatDate(rfqDate).substring(0, 11));
    $("#txtVehicleReqOn").val(formatDate(vehicleReqOn).substring(0, 11));
}

function GetAllVendorList() {
    var getUrl = '/Vendor/GetAllVendorList'
    $.ajax({
        url: getUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            const VednorListDropdown = document.getElementById("txtVednorName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Vednor Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            VednorListDropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                VednorListDropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Consignor Name!", "Error");
            $("#ddlLocation").val()
        }

    });
};
