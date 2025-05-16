const rfqTypeArray = ["Contractual", "Adhoc"];
const rfqPriorityArray = ["High", "Medium"];
const rfqOnArray = ["Qty", "Vehicle"];
$("#ddlRfqOn").on('change', function () {
    if (($("#ddlRfqOn").val()) == rfqOnArray[0]) {
        $("#ddlVehicleType").prop('disabled', true);
        $("#ddlVehicleType").selectpicker('refresh');
        $("#txtNoofVehicles").prop('disabled', true);
        $("#txtTotalQty").prop('disabled', false);
    }
    else {
        $("#txtTotalQty").prop('disabled', true);
        $("#ddlVehicleType").prop('disabled', false);
        $("#ddlVehicleType").selectpicker('refresh');
        $("#txtNoofVehicles").prop('disabled', false);
    }
});
$(document).ready(function () {
    GetAllCustomerName()
    GetAllVehicleType()
    GetAllItemName()
    GetAllPakingType()
    BindDropDown(rfqTypeArray, "ddlRfqType", "Select a RFQ Type")
    BindDropDown(rfqPriorityArray, "ddlRfqPriority", "Select a RFQ Priority")
    BindDropDown(rfqOnArray, "ddlRfqOn", "Select a RFQ On")
});
function GetAllCustomerName() {
    var GetUrl = '/Customer/ViewCustomer';
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
            console.log(response);
            const packingTypedropdown = document.getElementById("ddlPackingType");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a PakingType";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            packingTypedropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.packingId;
                option.textContent = item.packingName;
                packingTypedropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Paking Type!", "Error");
        }
    });
}
function OnSubmitValidation() {
    if (IsNullOrEmpty($("#txtRfqDate").val())){
        toastr.warning("Please enter a valid RFQ Date", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlCustomerName").val())) {
        toastr.warning("Please select a valid Customer Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtOrigin").val())) {
        toastr.warning("Please enter a valid Origin", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtDestination").val())){
        toastr.warning("Please enter a valid Destination", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlRfqOn").val())) {
        toastr.warning("Please select a valid Rfq On", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlVehicleType").val())) {
        toastr.warning("Please select a valid Vehicle Type", "Validation Error");
        return false;
    }
    
    return true;
}
function BindDropDown(optionArray,elementId,placeholder) {
    const dropdown = document.getElementById(elementId);
    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    dropdown.appendChild(placeholderOption);

    optionArray.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
    $('.selectpicker').selectpicker('refresh');
}
