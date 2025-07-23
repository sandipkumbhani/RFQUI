var VehicIndentList;
$(document).ready(function () {

    //CheckValidation();
    $("#btnSaveType, #btnSaveAndNew").on('click', function () {

        var action = $(this).data('action'); // "save" or "saveNew"
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });

    $('#ddlIndent').on('change', function () {
        const selectedValue = $(this).val();

        const selectedIndent = VehicIndentList.find(x => x.indentId == selectedValue);

        if (selectedIndent) {
            $("#ddlCustomerName").selectpicker('val', selectedIndent.partyId);
            $('#ddlCustomerName').selectpicker('refresh');
            $("#ddlVehicleType").selectpicker('val', selectedIndent.vehicleTypeId);
            $('#ddlVehicleType').selectpicker('refresh');
            $("#ddlOrigin").selectpicker('val', selectedIndent.fromLocation);
            $('#ddlOrigin').selectpicker('refresh');
            $("#ddlDestination").selectpicker('val', selectedIndent.toLocation);
            $('#txtDestination').selectpicker('refresh');
            $('#txtNoofVehicles').val(selectedIndent.requiredVehicles);
            $('#txtVehicleReqDate').val(selectedIndent.vehicleReqOn);
            let dateValue = selectedIndent.vehicleReqOn;
            if (dateValue) {
                // If it's a Date object, format it
                if (dateValue instanceof Date) {
                    dateValue = dateValue.toISOString().split('T')[0];
                } else if (typeof dateValue === "string" && dateValue.includes("T")) {
                    dateValue = dateValue.split('T')[0];
                }
                $('#txtVehicleReqDate').val(dateValue);
            } else {
                $('#txtVehicleReqDate').val('');
            }

        }
    });
    GetAllCustomer();
    GetAllVehicleType();
    GetAllItemName();
    GetAllPakingType();
    GetAllLocation();
    GetAllVehicleIndent();
    FetchVendorData();
    FetchRfqNo();
    GetAllVendorList();
    RenderFetchTable();
    ClearFetchForm();
    SaveRfqVendorDetails();
    GetAllStateList("ddlOrigin");
    GetAllStateList("ddlDestination");
    GetAllCustomer("ddlCustomerName");
    GetAllVehicleType("ddlVehicleType");
    GetAllItemName("ddlItemName");

});
function CheckValidation() {
    $("#ddlLocation").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please Select a Location", "Validation Error");
            return;
        }
    });
}
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Location", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRfqNo").val())) {
        toastr.warning("Please enter a RFQ No", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRfqDate").val())) {
        toastr.warning("Please enter a RFQ Date", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRfqExpiredOn").val())) {
        toastr.warning("Please enter a RFQ Expired On", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlIndent").val())) {
        toastr.warning("Please Select a Indent No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlCustomerName").val())) {
        toastr.warning("Please Select a Customer Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtVehicleReqDate").val())) {
        toastr.warning("Please enter a Vehicle Req On", "Validation Error");
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
        toastr.warning("Please enter a No. of Vehicles", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtMaxCosting").val())) {
        toastr.warning("Please enter a Max Costing", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtPerDay").val())) {
        toastr.warning("Please enter a Detention Per Day", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtFreeDay").val())) {
        toastr.warning("Please enter a Detention Free Days", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlRfqPriority").val())) {
        toastr.warning("Please Select a RFQ Priority", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlRfqType").val())) {
        toastr.warning("Please Select a RFQ Type", "Validation Error");
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
    if (IsNullOrEmpty($("#txtSpecialInstructions").val())) {
        toastr.warning("Please enter a Special Instructions", "Validation Error");
        return false;
    }


    return true;
}
var fetchedVendorDataList = [];
var vendorList = [];
var rfqId;

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
function GetAllLocation() {
    $.ajax({
        url: '/Location/GetAllLocationList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById("ddlLocation");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Location";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.locationId;
                opt.textContent = option.locationName;
                selectLocation.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllVehicleIndent() {
    var getVehicleTypeUrl = '/RequestForQuote/GetAllVehicleIndentList'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            response = response.result;
            VehicIndentList = response;
            const Indentdropdown = document.getElementById("ddlIndent");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Indent No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            Indentdropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.indentId;
                option.textContent = item.indentNo;
                Indentdropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function FetchRfqNo() {
    $.ajax({
        url: "/RequestForQuote/GetRfqNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtRfqNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function GetAllVendorList() {
    var getUrl = '/Vendor/GetAllVendorList'
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            fetchedVendorDataList = response;
            const vendorListDropdown = document.getElementById("ddlRFQVendorList");
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
    $("#ddlRFQVendorList").on('change', function () {
        const selectedVendorId = $(this).val();
        if (selectedVendorId == null) {
            return;
        }
        const selectedVendorData = fetchedVendorDataList.find(x => x.partyId == selectedVendorId);
        $("#fetchVendorPanNo").val(selectedVendorData.panNo);
        $("#fetchVendorRating").val("5");
        $("#fetchVendorMobileNo").val(selectedVendorData.mobNo);
        $("#fetchVendorWhatsappNo").val(selectedVendorData.whatsAppNo);
        $("#fetchVendorEmailId").val(selectedVendorData.email);
    })
}
function RenderFetchTable() {
    const tbody = $('#rfqVendorTable tbody');
    tbody.empty();
    $.each(vendorList, function (index, vendor) {
        const row = `
      <tr data-index="${index}">
        <td>${index + 1}</td>
        <td>${vendor.VendorName}</td>
        <td>${vendor.PanNo}</td>
        <td>${vendor.VendorRating}</td>
        <td>${vendor.MobileNo}</td>
        <td>${vendor.WhatsappNo}</td>
        <td>${vendor.EmailId}</td>
        <td>
          <button type="button" class="editVendor" style="color:blue;border:none;background:none;">Edit</button> /
          <button type="button" class="deleteVendor" style="color:blue;border:none;background:none;">Delete</button>
        </td>
      </tr>
    `;
        tbody.append(row);
    });
}
function ClearFetchForm() {
    $("#fetchVendorPanNo").val('');
    $("#fetchVendorRating").val('');
    $("#fetchVendorMobileNo").val('');
    $("#fetchVendorWhatsappNo").val('');
    $("#fetchVendorEmailId").val('');
    $('#ddlRFQVendorList').val(null).trigger('change');
}
$('#btnAddVendor').on('click', function () {
    const getSelectVendorID = $("#ddlRFQVendorList").val();
    if (getSelectVendorID == null || getSelectVendorID == '') {
        toastr.warning("Please Select Vendor Name!", "Warning");
        return;
    }
    const getvendorName = $('#ddlRFQVendorList option:selected').text();
    const getpanNo = $("#fetchVendorPanNo").val();
    const getVendorRating = $("#fetchVendorRating").val();
    const getMobileNo = $("#fetchVendorMobileNo").val();
    const getWhatsappNo = $("#fetchVendorWhatsappNo").val();
    const getEmail = $("#fetchVendorEmailId").val();

    vendorList.push({
        VendorId: parseInt(getSelectVendorID),
        VendorName: getvendorName,
        PanNo: getpanNo,
        VendorRating: parseInt(getVendorRating) || 0,
        MobileNo: getMobileNo,
        WhatsappNo: getWhatsappNo,
        EmailId: getEmail
    });
    RenderFetchTable();
    ClearFetchForm();
});
$('#btnCancelVendor').on('click', function () {
    ClearFetchForm();
});
$('#rfqVendorTable').on('click', '.deleteVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    vendorList.splice(rowIndex, 1);
    RenderFetchTable();
});
$('#rfqVendorTable').on('click', '.editVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    const vendor = vendorList[rowIndex];
    const mobileNoInputHtml = `<input type="text" id="editMobileNo" class="form-control" maxlength="10" value="${vendor.MobileNo}">`;
    const whatsappNoInputHtml = `<input type="text" id="editWhatsappNo" class="form-control" maxlength="10" value="${vendor.WhatsappNo}">`;
    const emailInputHtml = `<input type="email" id="editEmailId" class="form-control" maxlength="50" value="${vendor.EmailId}">`;

    $(this).closest('tr').find('td:nth-child(5)').html(mobileNoInputHtml);
    $(this).closest('tr').find('td:nth-child(6)').html(whatsappNoInputHtml);
    $(this).closest('tr').find('td:nth-child(7)').html(emailInputHtml);

    const actionButtonsHtml = `  
                     <button type="button" class="saveEditVendor" style="color:blue;border:none;background:none;">Save</button> /  
                     <button type="button" class="cancelEditVendor" style="color:blue;border:none;background:none;">Cancel</button>  
                  `;
    $(this).closest('tr').find('td:nth-child(8)').html(actionButtonsHtml);

    $('.saveEditVendor').on('click', function () {
        const updatedMobileNo = $('#editMobileNo').val();
        const updatedWhatsappNo = $('#editWhatsappNo').val();
        const updatedEmailId = $('#editEmailId').val();

        if (!updatedMobileNo || !updatedEmailId) {
            toastr.warning("Please fill all required fields!", "Validation Error");
            return;
        }

        vendorList[rowIndex].MobileNo = updatedMobileNo;
        vendorList[rowIndex].WhatsappNo = updatedWhatsappNo;
        vendorList[rowIndex].EmailId = updatedEmailId;

        RenderFetchTable();
    });

    $('.cancelEditVendor').on('click', function () {
        RenderFetchTable();
    });

});

function SaveAndSaveNew(action) {
    var saveUrl = '/RequestForQuote/AddRfq';
    const formData = {
        RfqNo: $('#txtRfqNo').val(),
        CompanyId: $('#ddlLocation').val(),
        LocationId: $('#ddlLocation').val(),
        IndentId: $('#ddlIndent').val(),
        RfqDate: $('#txtRfqDate').val(),
        ExpiryDate: $('#txtRfqExpiredOn').val(),
        PartyId: $('#ddlCustomerName').val(),
        VehicleReqOn: $('#txtVehicleReqDate').val(),
        FromLocation: $('#ddlOrigin').val(),
        //FromLatitude: null,
        //FromLongitude: null,
        ToLocation: $('#ddlDestination').val(),
        //ToLatitude: null,
        //ToLongitude: null,
        VehicleRequiredOn: $('#txtVehicleReqDate').val(),
        VehicleTypeId: $('#ddlVehicleType').val(),
        VehicleCount: $('#txtNoofVehicles').val(),
        RfqPriorityId: $('#ddlRfqPriority').val(),
        RfqTypeId: $('#ddlRfqType').val(),
        ItemId: $('#ddlItemName').val(),
        MaxCosting: $('#txtMaxCosting').val(),
        DetentionPerDay: $('#txtPerDay').val(),
        DetentionFreeDays: $('#txtFreeDay').val(),
        PackingTypeId: $('#ddlPackingType').val(),
        SpecialInstruction: $('#txtSpecialInstructions').val(),
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
                    rfqId = response.rfqId;
                    window.location.href = "../Dashboard/Dashboard";
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Request For Quote.", "Error");
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
                    rfqId = response.rfqId;
                    toastr.success("Vehicle Indent Saved Successfully!", "Success");
                    $('#RfqDetailsForm')[0].reset();
                    $('#ddlLocation').val(null).trigger('change');
                    $('#ddlIndent').val(null).trigger('change');
                    $('#ddlCustomerName').val(null).trigger('change');
                    $('#ddlVehicleType').val(null).trigger('change');
                    $('#ddlRfqPriority').val(null).trigger('change');
                    $('#ddlRfqType').val(null).trigger('change');
                    $('#ddlItemName').val(null).trigger('change');
                    $('#ddlPackingType').val(null).trigger('change');
                    FetchRfqNo();
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Request For Quote.", "Error");
            }
        });
    }
}
function SaveRfqVendorDetails() {
    var saveUrl = '/RfqRecipient/AddRfqRecipient';
    $("#btnSaveRfqVendorDetails").on('click', function () {
        var formData = vendorList.map(vendor => ({
            RfqId: rfqId,
            VendorId: vendor.VendorId,
            PanNo: vendor.PanNo,
            VendorRating: vendor.VendorRating,
            MobNo: vendor.MobileNo,
            WhatsAppNo: vendor.WhatsappNo,
            EmailId: vendor.EmailId
        }));
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response != null) {
                    toastr.success("Request For Quote Submitted Successfully!", "Success");
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Request For Quote.", "Error");
            }
        });
    });
}