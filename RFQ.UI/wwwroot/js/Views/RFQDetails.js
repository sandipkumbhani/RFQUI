var VehicIndentList;
var companyId;
var rfqId;
var fetchedVendorDataList = [];
var vendorList = [];
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    CheckValidation();
    $("#btnSaveType, #btnSaveAndNew").on('click', function () {

        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });

    $('#ddlIndent').on('change', function () {
        const selectedValue = $(this).val();

        const selectedIndent = VehicIndentList.find(x => x.indentId == selectedValue);

        if (selectedIndent) {
            $("#ddlCustomerName").val(selectedIndent.partyId).trigger('change');
            $("#ddlVehicleType").val(selectedIndent.vehicleTypeId).trigger('change');
            $('#from-search-box').val(selectedIndent.fromLocation);
            $('#to-search-box').val(selectedIndent.toLocation);
            $('#txtNoofVehicles').val(selectedIndent.requiredVehicles);
            $('#txtVehicleReqDate').val(selectedIndent.vehicleReqOn.split('T')[0]);
            $('#fromState').val(selectedIndent.fromLocationState);
            $('#fromCity').val(selectedIndent.fromLocationCity);
            $('#fromLat').val(selectedIndent.fromLatitude);
            $('#fromLng').val(selectedIndent.fromLongitude);
            $('#toState').val(selectedIndent.toLocationState);
            $('#toCity').val(selectedIndent.toLocationCity);
            $('#toLat').val(selectedIndent.toLatitude);
            $('#toLng').val(selectedIndent.toLongitude);
        }
    });
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    GetAllVehicleIndent();
    GetRfqType();
    GetRfqPriority();
    FetchVendorData();
    FetchRfqNo();
    RenderFetchTable();
    ClearFetchForm();
    SaveRfqVendorDetails();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);
    GetAllItemName("ddlItemName", companyId);
    GetAllPakingType("ddlPackingType");
});
function CheckValidation() {
    $("#ddlLocation").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please Select a Location", "Validation Error");
            return;
        }
    });
    $("#txtRfqExpiredOn").on("change", function () {
        var expireDate = $(this).val().split('T')[0];
        if (expireDate <= $('#txtVehicleReqDate').val()) {
            toastr.warning("Indent Expired On date must be greater than Vehicle Req On Date.", "Warning");
            $(this).val('');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const rfqDetailsTab = document.getElementById("rfqDetails-tab");
    const vendorDetailsTab = document.getElementById("vendorDetails-tab");
    const previousQuotes = document.getElementById("previousQuotes-tab");

    if (vendorDetailsTab) {
        vendorDetailsTab.addEventListener("click", function () {
            if (OnSubmitCheckValidation()) {
                GetAllVendorList();
            } else {
                rfqDetailsTab.click();
                return
            }
        });
    }
    if (previousQuotes) {
        previousQuotes.addEventListener("click", function () {
            if (!isValidateSelect($("#ddlIndent").val())) {
                toastr.warning("Please Select a Indent No", "Validation Error");
                rfqDetailsTab.click();
                return;
            } else {
                GetPreviousQuotesList();
            }
        });
    }
});
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
    if (IsNullOrEmpty($("#txtRfqExpiredOn").val())) {
        toastr.warning("Please enter a RFQ Expired On", "Validation Error");
        return false;
    }
    if ($("#txtRfqExpiredOn").val().split('T')[0] <= $('#txtVehicleReqDate').val()) {
        toastr.warning("Indent Expired On date must be greater than Vehicle Req On Date.", "Warning");
        $("#txtRfqExpiredOn").val('');
        return false;
    }
    if (IsNullOrEmpty($("#from-search-box").val())) {
        toastr.warning("Please enter a Origin/From", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#to-search-box").val())) {
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
    if (IsNullOrEmpty($("#txtRfqSubject").val())) {
        toastr.warning("Please enter a RFQ Subject", "Validation Error");
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
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function GetRfqType() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.RFQ_TYPE);
            const select = document.getElementById("ddlRfqType");
            select.innerHTML = "";

            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a RFQ Type";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            internalData.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.internalMasterId;
                opt.textContent = option.internalMasterName;
                select.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetRfqPriority() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.RFQ_PRIORITY);
            const select = document.getElementById("ddlRfqPriority");
            select.innerHTML = "";

            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a RFQ Priority";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            internalData.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.internalMasterId;
                opt.textContent = option.internalMasterName;
                select.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
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
    $("#ddlRFQVendorList").empty();
    var getUrl = '/RequestForQuote/GetAllVendorListForRfq'
    var fromOrigin = $('#from-search-box').val();
    let fromOriginParts = fromOrigin.split(',');
    let fromStateName = fromOriginParts[1].trim().toUpperCase();
    var toDestination = $('#to-search-box').val();
    let toDestinationParts = toDestination.split(',');
    let toStateName = toDestinationParts[1].trim().toUpperCase();
    var formData = {
        OriginFrom: fromStateName,
        ToDestination: toStateName,
        VehicleTypeId: $('#ddlVehicleType').val()
    }
    $.ajax({
        url: getUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            fetchedVendorDataList = response;
            BindAllVendorList(fetchedVendorDataList);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vendor Name!", "Error");
        }
    });
}
function BindAllVendorList(fetchedVendorDataList) {
    $("#ddlRFQVendorList").empty();
    const vendorListDropdown = document.getElementById("ddlRFQVendorList");
    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a Vendor Name";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    vendorListDropdown.appendChild(placeholderOption);
    fetchedVendorDataList.forEach(item => {
        const option = document.createElement("option");
        option.value = item.partyId;
        option.textContent = item.partyName;
        vendorListDropdown.appendChild(option);
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
    fetchedVendorDataList = $.grep(fetchedVendorDataList, function (item) {
        return item.partyId != getSelectVendorID;
    });
    BindAllVendorList(fetchedVendorDataList);
});

$('#btnCancelVendor').on('click', function () {
    ClearFetchForm();
});

$('#rfqVendorTable').on('click', '.deleteVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    const deletedVendor = vendorList.splice(rowIndex, 1);
    RenderFetchTable();
    deletedVendor.forEach(item => {
        fetchedVendorDataList.push({
            email: item.EmailId,
            mobNo: item.MobileNo,
            panNo: item.PanNo,
            partyId: item.VendorId,
            partyName: item.VendorName,
            whatsAppNo: item.WhatsappNo
        });
    })
    BindAllVendorList(fetchedVendorDataList);
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
    const rfqFormData = {
        //RfqId:0,
        RfqNo: $('#txtRfqNo').val(),
        //CompanyId:0,
        LocationId: $('#ddlLocation').val(),
        IndentId: $('#ddlIndent').val(),
        RfqDate: $('#txtRfqDate').val(),
        ExpiryDate: $('#txtRfqExpiredOn').val(),
        PartyId: $('#ddlCustomerName').val(),
        VehicleReqOn: $('#txtVehicleReqDate').val(),
        FromLocation: $('#from-search-box').val(),
        FromLocationState: $('#fromState').val(),
        FromLocationCity: $('#fromCity').val(),
        FromLatitude: $('#fromLat').val(),
        FromLongitude: $('#fromLng').val(),
        ToLocation: $('#to-search-box').val(),
        ToLocationState: $('#toState').val(),
        ToLocationCity: $('#toCity').val(),
        ToLatitude: $('#toLat').val(),
        ToLongitude: $('#toLng').val(),
        VehicleTypeId: $('#ddlVehicleType').val(),
        VehicleCount: $('#txtNoofVehicles').val(),
        RfqSubject: $('#txtRfqSubject').val(),
        RfqPriorityId: $('#ddlRfqPriority').val(),
        RfqTypeId: $('#ddlRfqType').val(),
        ItemId: parseInt($('#ddlItemName').val()),
        MaxCosting: parseInt($('#txtMaxCosting').val()),
        DetentionPerDay: parseInt($('#txtPerDay').val()),
        DetentionFreeDays: parseInt($('#txtFreeDay').val()),
        PackingTypeId: parseInt($('#ddlPackingType').val()),
        SpecialInstruction: $('#txtSpecialInstructions').val(),
        LinkId: parseInt(GetQueryParam("LinkId"))
    };
    const recipientFormData = vendorList.map(vendor => ({
        //RfqRecipientId: 0,
        //RfqId:0,
        VendorId: vendor.VendorId,
        PanNo: vendor.PanNo,
        VendorRating: vendor.VendorRating,
        MobNo: vendor.MobileNo,
        WhatsAppNo: vendor.WhatsappNo,
        EmailId: vendor.EmailId
    }));
    var formData = {
        RfqRequestDto: rfqFormData,
        RfqRecipients: recipientFormData
    }
    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    console.log(response);
                    rfqId = response.rfqId;
                    toastr.success("Request For Quote Saved Sucessfully", "success");
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
                    console.log(response);
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
        debugger;
        var formData = vendorList.map(vendor => ({
            RfqId: rfqId,
            VendorId: vendor.VendorId,
            PanNo: vendor.PanNo,
            VendorRating: vendor.VendorRating,
            MobNo: vendor.MobileNo,
            WhatsAppNo: vendor.WhatsappNo,
            EmailId: vendor.EmailId
        }));
        sendQuoteLinksForVendors(formData);
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
function sendQuoteLinksForVendors(vendorList) {
    debugger;
    const formData = vendorList.map(vendor => ({
        RfqRecipientId: 0,
        RfqId: rfqId,
        VendorId: vendor.VendorId,
        PanNo: vendor.PanNo,
        VendorRating: vendor.VendorRating,
        MobNo: vendor.MobileNo,
        WhatsAppNo: vendor.WhatsAppNo,
        EmailId: vendor.EmailId
    }));

    $.ajax({
        url: '/QuoteRateVendor/SendQuoteLinks', // Must match your controller route
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            console.log("Links generated successfully:", response.links);

            // Example: Display or send links via WhatsApp
            response.links.forEach(linkInfo => {
                console.log(`Vendor ${linkInfo.VendorId} - Link: ${linkInfo.Link}`);

                // Send via WhatsApp browser link (optional)
                if (linkInfo.WhatsAppNo) {
                    const message = encodeURIComponent("Please fill your RFQ form: " + linkInfo.Link);
                    const waUrl = `https://wa.me/${linkInfo.WhatsAppNo}?text=${message}`;
                    window.open(waUrl, '_blank');
                }
            });
        },
        error: function (xhr) {
            console.error("Error sending quote links", xhr);
            alert("Failed to send links.");
        }
    });
}
function GetPreviousQuotesList() {
    var fromOrigin = $('#from-search-box').val();
    let fromOriginParts = fromOrigin.split(',');
    let fromStateName = fromOriginParts[1].trim().toUpperCase();
    var toDestination = $('#to-search-box').val();
    let toDestinationParts = toDestination.split(',');
    let toStateName = toDestinationParts[1].trim().toUpperCase();
    var requestData = {
        OriginFrom: fromStateName,
        ToDestination: toStateName,
        VehicleTypeId: parseInt($('#ddlVehicleType').val()),
    };

    $.ajax({
        url: '/RequestForQuote/GetPreviousQuotesList',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (response) {
            const tbody = $("#previousQoutesTable tbody");
            tbody.empty();
            if (!response || !Array.isArray(response) || response.length <= 0) {
                tbody.append('<tr><td colspan="12" class="text-center">No records found</td></tr>');
            }
            $.each(response, function (index, quotes) {
                const rowHtml = `
                        <tr data-index="${index}">
                        <td>${index + 1}</td>
                        <td>${quotes.partyName}</td >
                        <td>${quotes.panNo}</td >
                        <td>5</td >
                        <td>${quotes.rfqDate.split(" ")[0]}</td>
                        <td>${quotes.totalHireCost}</td>
                    </tr>`;
                tbody.append(rowHtml);
            })
        },
        error: function (xhr, status, error) {
            toastr.error('Failed to fetch previous quotes:', "Error");
        }
    });
}
