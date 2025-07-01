$(document).ready(function () {
    CheckValidation();
    $("#btnSave, #btnSaveAndNew").on('click', function () {
        var action = $(this).data('action'); // "save" or "saveNew"
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });
    GetAllCustomer();
    GetAllVehicleType();
    GetAllItemName();
    GetAllPakingType();
    GetAllVendorList();
    FetchVendorData();
});
let vendorList = [];
var fetchedVendorDataList;
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
function GetAllVendorList() {
    var getUrl = '/Branch/GetAllVendorList'
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            fetchedVendorDataList = response;
            const vendorListDropdown = document.getElementById("ddlFetchVendorName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Vendor Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vendorListDropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                vendorListDropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vendor Name!", "Error");
        }
    });
}
function FetchVendorData() {
    $("#ddlFetchVendorName").on('change', function () {
        const selectedVendorId = $(this).val();
        const selectedVendorData = fetchedVendorDataList.find(x => x.partyId == selectedVendorId);
        $("#fetchVendorPanNo").val(selectedVendorData.panNo);
        $("#fetchVendorRating").val("5");
        $("#fetchVendorMobileNo").val(selectedVendorData.mobNo);
        $("#fetchVendorWhatsappNo").val(selectedVendorData.whatsAppNo);
        $("#fetchVendorEmailId").val(selectedVendorData.email);
    })
}
function renderTable() {
    const tbody = $('#rfqVendorTable tbody');
    tbody.empty();
    $.each(vendorList, function (index, vendor) {
        const row = `
      <tr data-index="${index}">
        <td>${index + 1}</td>
        <td>${vendor.getvendorName}</td>
        <td>${vendor.getpanNo}</td>
        <td>${vendor.getVendorRating}</td>
        <td>${vendor.getMobileNo}</td>
        <td>${vendor.getWhatsappNo}</td>
        <td>${vendor.getEmail}</td>
        <td>
          <button type="button" class="editVendor" style="color:blue;border:none;background:none;">Edit</button> /
          <button type="button" class="deleteVendor" style="color:blue;border:none;background:none;">Delete</button>
        </td>
      </tr>
    `;
        tbody.append(row);
    });
}
function clearForm() {
    $("#fetchVendorPanNo").val('');
    $("#fetchVendorRating").val('');
    $("#fetchVendorMobileNo").val('');
    $("#fetchVendorWhatsappNo").val('');
    $("#fetchVendorEmailId").val('');
    $('#ddlFetchVendorName').val(null).trigger('change');

}
$('#addBtn').on('click', function () {
    const getSelectVendorID = $("#ddlFetchVendorName").val();
    if (getSelectVendorID == null || getSelectVendorID == '') {
        toastr.warning("Please Select Vendor Name!", "Warning");
        return;
    }
    const getvendorName = $('#ddlFetchVendorName option:selected').text();
    const getpanNo = $("#fetchVendorPanNo").val();
    const getVendorRating = $("#fetchVendorRating").val();
    const getMobileNo = $("#fetchVendorMobileNo").val();
    const getWhatsappNo = $("#fetchVendorWhatsappNo").val();
    const getEmail = $("#fetchVendorEmailId").val();
    vendorList.push({ getvendorName, getpanNo, getVendorRating, getMobileNo, getWhatsappNo, getEmail });
    renderTable();
    clearForm();
});
$('#cancelBtn').on('click', function () {
    clearForm();
});
$('#rfqVendorTable').on('click', '.deleteVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    if (confirm('Are you sure to delete this vendor?')) {
        vendorList.splice(rowIndex, 1);
        renderTable();
    }
});
$('#rfqVendorTable').on('click', '.editVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    const vendor = vendorList[rowIndex];
    $('#vendorName').val(vendor.vendorName);
    $('#panNo').val(vendor.panNo);
    vendorList.splice(rowIndex, 1); // remove current so it can be updated on next Add
    renderTable();
});