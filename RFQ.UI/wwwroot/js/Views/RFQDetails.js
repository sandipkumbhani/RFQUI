var VehicIndentList;
var companyId;
var rfqId;
var fetchedVendorDataList = [];
var orderColumn = '';
var orderDir = '';
var fetchRfqUrl = '/RequestForQuote/GetAllRfq';
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    CheckValidation();
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); 

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('rfqTable', fetchRfqUrl, orderColumn, orderDir.toUpperCase());
    });
    $("#btnCancel").on("click", function () {
        FetchRfqList();
    });
    $("#btnSaveType, #btnSaveAndNew").on('click', function () {

        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            showLoader();
            SaveAndSaveNew(action);
        }
    });
    $("#btnAddRfq").on("click", function () {
        $("#tableDiv").css('display', 'none ');
        $("#formDiv").css('display', 'block');
    });
    $('#tableDivLink').on('click', function (e) {
        e.preventDefault(); 
        $("#tableDiv").show();
        $("#formDiv").hide();
    });
    $('#ddlIndent').on('change', function () {
        const selectedValue = $(this).val();
        if (!selectedValue) {
            return;
        }
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
            $("#ddlItemName").val(selectedIndent.itemId).trigger('change');
            $("#ddlPackingType").val(selectedIndent.packingTypeId).trigger('change');
        }
    });
    FetchRfqList();
    UpdateRfq();
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    GetAllVehicleIndent();
    GetRfqType();
    GetRfqPriority();
    FetchRfqNo();
    RenderFetchTable();
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
    $("#txtRfqExpiredOn").on('input', function () {
        if (!isValidateSelect($("#ddlIndent").val())) {
            toastr.warning("Please select an Indent No", "Validation Error");
            $("#txtRfqExpiredOn").val('');
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
    //if (IsNullOrEmpty($("#txtMaxCosting").val())) {
    //    toastr.warning("Please enter a Max Costing", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#txtPerDay").val())) {
    //    toastr.warning("Please enter a Detention Per Day", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#txtFreeDay").val())) {
    //    toastr.warning("Please enter a Detention Free Days", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#txtRfqSubject").val())) {
    //    toastr.warning("Please enter a RFQ Subject", "Validation Error");
    //    return false;
    //}
    //if (!isValidateSelect($("#ddlRfqPriority").val())) {
    //    toastr.warning("Please Select a RFQ Priority", "Validation Error");
    //    return false;
    //}
    //if (!isValidateSelect($("#ddlRfqType").val())) {
    //    toastr.warning("Please Select a RFQ Type", "Validation Error");
    //    return false;
    //}
    //if (!isValidateSelect($("#ddlItemName").val())) {
    //    toastr.warning("Please Select a Item Name", "Validation Error");
    //    return false;
    //}
    //if (!isValidateSelect($("#ddlPackingType").val())) {
    //    toastr.warning("Please Select a Packing Type", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#txtSpecialInstructions").val())) {
    //    toastr.warning("Please enter a Special Instructions", "Validation Error");
    //    return false;
    //}


    return true;
}
function GetAllVehicleIndent() {
    var getVehicleTypeUrl = '/RequestForQuote/GetAllVehicleIndentList'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        data: { companyId: companyId },
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
    let fromStateName = $("#fromState").val().toUpperCase();
    let toStateName = $("#toState").val().toUpperCase();
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
    const tbody = $("#rfqVendorTable tbody");
    tbody.empty();
    if (!fetchedVendorDataList || !Array.isArray(fetchedVendorDataList) || fetchedVendorDataList.length <= 0) {
        tbody.append('<tr><td colspan="12" class="text-center">No records found</td></tr>');
    }
    $.each(fetchedVendorDataList, function (index, vendor) {
        const rowHtml = `
                        <tr data-index="${index}">
                        <td>${index + 1}</td>
                        <td>${vendor.partyName}</td >
                        <td>${vendor.panNo}</td >
                        <td>5</td >
                        <td>${vendor.mobNo}</td>
                        <td>${vendor.whatsAppNo}</td>
                        <td>${vendor.email}</td>
                        <td class="text-center action-items" style="cursor:pointer;">
                            <a class="icon-btn" id="editVendor"><i class="ri-edit-2-line"></i></a>
                            <a class="icon-btn" id="deleteVendor"><i class="ri-delete-bin-3-line"></i></a>
                        </td>
                    </tr>`;
        tbody.append(rowHtml);
    })
}
function RenderFetchTable() {
    const tbody = $('#rfqVendorTable tbody');
    tbody.empty();
    $.each(fetchedVendorDataList, function (index, vendor) {
        const row = `
      <tr data-index="${index}">
        <td>${index + 1}</td>
        <td>${vendor.partyName}</td>
        <td>${vendor.panNo}</td>
        <td>5</td>
        <td>${vendor.mobNo}</td>
        <td>${vendor.whatsAppNo}</td>
        <td>${vendor.email}</td>
        <td class="text-center action-items" style="cursor:pointer;">
                            <a class="icon-btn" id="editVendor"><i class="ri-edit-2-line"></i></a>
                            <a class="icon-btn" id="deleteVendor"><i class="ri-delete-bin-3-line"></i></a>
        </td>
      </tr>
    `;
        tbody.append(row);
    });
}

$('#rfqVendorTable').on('click', '#deleteVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    const deletedVendor = fetchedVendorDataList.splice(rowIndex, 1);
    RenderFetchTable();
});

$('#rfqVendorTable').on('click', '#editVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    const vendor = fetchedVendorDataList[rowIndex];
    const mobileNoInputHtml = `<input type="text" id="editMobileNo" class="form-control" maxlength="10" value="${vendor.mobNo}">`;
    const whatsappNoInputHtml = `<input type="text" id="editWhatsappNo" class="form-control" maxlength="10" value="${vendor.whatsAppNo}">`;
    const emailInputHtml = `<input type="email" id="editEmailId" class="form-control" maxlength="50" value="${vendor.email}">`;

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

        fetchedVendorDataList[rowIndex].mobNo = updatedMobileNo;
        fetchedVendorDataList[rowIndex].whatsAppNo = updatedWhatsappNo;
        fetchedVendorDataList[rowIndex].email = updatedEmailId;

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
    const recipientFormData = fetchedVendorDataList.map(vendor => ({
        VendorId: vendor.partyId,
        PanNo: vendor.panNo,
        VendorRating: "5",
        MobNo: vendor.mobNo,
        WhatsAppNo: vendor.whatsAppNo,
        EmailId: vendor.email
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
                    rfqId = response.rfqRequestDto.rfqId;
                    Saveattachment(rfqId);
                    toastr.success("Request For Quote Saved Sucessfully", "success");
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
               
            },
            complete: function () {
                hideLoader();
                window.location.reload();
            },
            error: function (xhr, status, error) {
                hideLoader();
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
                    rfqId = response.rfqRequestDto.rfqId;
                    Saveattachment(rfqId);
                    toastr.success("Request For Quote Saved Sucessfully", "success");
                    $('#RfqDetailsForm')[0].reset();
                    $('.select2-custom').val(null).trigger('change');
                    FetchRfqNo();
                    setTimeout(() => {
                        ResetAttachmentRepeater();
                    }, 1000);
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
function EditRfq(rfqID) {
    var data = viewModelDto.filter(x => x.rfqId === rfqID);
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, rfqID, function (list) {
        var attachmentData = list;
        $('#tableDiv').css('display', 'none');
        $("#formDiv").css('display', 'Block');
        $("#button-main").css('display', 'Block');
        $("#vendorDetails-tab").prop('disabled', true);
        $("#previousQuotes-tab").prop('disabled', true);
        $("#txtRfqDetailsId").val(formData.rfqId);
        $("#ddlLocation").val(formData.locationId).trigger('change');
        $("#txtRfqNo").val(formData.rfqNo);
        $("#txtRfqDate").val(formData.rfqDate.split('T')[0]);
        $("#txtRfqExpiredOn").val(formData.expiryDate);
        $("#ddlIndent").val(formData.indentId).trigger('change');
        $("#ddlIndent").prop('disabled', true);
        $("#ddlCustomerName").val(formData.partyId).trigger('change');
        $("#txtVehicleReqDate").val(formData.vehicleReqOn.split('T')[0]);
        $("#from-search-box").val(formData.fromLocation);
        $("#to-search-box").val(formData.toLocation);
        $("#ddlVehicleType").val(formData.vehicleTypeId).trigger('change');
        $("#txtNoofVehicles").val(formData.vehicleCount);
        $("#txtMaxCosting").val(formData.maxCosting);
        $("#txtPerDay").val(formData.detentionPerDay);
        $("#txtFreeDay").val(formData.detentionFreeDays);
        $("#txtRfqSubject").val(formData.rfqSubject);
        $("#ddlRfqPriority").val(formData.rfqPriorityId).trigger('change');
        $("#ddlRfqType").val(formData.rfqTypeId).trigger('change');
        $("#ddlItemName").val(formData.itemId).trigger('change');
        $("#ddlPackingType").val(formData.packingTypeId).trigger('change');
        $("#txtSpecialInstructions").val(formData.specialInstruction);

        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    });
}
function UpdateRfq() {
    $("#btnUpdateRfq").on('click', function (e) {
        e.preventDefault();
        var isvalid = OnSubmitCheckValidation();
        if (!isvalid) {
            return;
        }
        const rfqFormData = {
            RfqId: $("#txtRfqDetailsId").val(),
            RfqNo: $('#txtRfqNo').val(),
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
        const recipientFormData = []
        var formData = {
            RfqRequestDto: rfqFormData,
            RfqRecipients: recipientFormData
        }
        let repeaterItems = document.querySelectorAll("[data-repeater-item]");
        let updateAttachmentDetails = [];
        var linkd = GetQueryParam("LinkId");

        repeaterItems.forEach((item, index) => {
            let attId = item.querySelector("#hdnAttachmentId").value;
            let attachmentId = attId == '' ? 0 : attId;
            let fileName = item.querySelector("#txtFileName")?.value || "N/A";
            let attachmentType = item.querySelector(".ddlAttachment")?.selectedOptions[0]?.value || "N/A";
            let filePath = item.querySelector("#hdnUplodedFileName").value;

            updateAttachmentDetails.push({
                AttachmentId: attachmentId,
                AttachmentName: fileName,
                AttachmentTypeId: attachmentType,
                AttachmentPath: filePath,
                ReferenceLinkId: parseInt(linkd),
                TransactionId: $("#txtRfqDetailsId").val()
            });
        });

        var updateRfq = '/RequestForQuote/UpdateRfq';
        $.ajax({
            type: "PUT",
            url: updateRfq,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result === "success") {
                    toastr.success("Rfq Details Updated Successfully!");
                    FetchRfqList();
                } else {
                    toastr.error("Failed to Update Rfq Details", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Rfq Details", "Error");
            }
        });

        $.ajax({
            type: "PUT",
            url: '/MasterAttachment/UpdateMasterAttachment',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(updateAttachmentDetails),
            dataType: "json",
            success: function (response) {
                if (response.result == "success") {
                    rfqId = $("#txtRfqDetailsId").val();
                    Saveattachment(rfqId);
                } else {
                    $("#dataDiv").html("Failed to update profile.");
                }
            },
            error: function (xhr, status, error) {
                $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
            }
        });

        var deletedAttachments = JSON.parse(sessionStorage.getItem('deletedAttachments')) || [];
        $.each(deletedAttachments, function (index, value) {
            DeleteAttachmentAPI(value);
        });
    });
}
function DeleteRfq(rfqID) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var deleteRfqUrl = '/RequestForQuote/DeleteRfq/' + rfqID;
            var result;
            var linkId = parseInt(GetQueryParam("LinkId"));
            FetchMasterAttachment(linkId, rfqID, function (list) {
                result = list;

                $.ajax({
                    url: deleteRfqUrl,
                    type: "DELETE",
                    dataType: "json",
                    data: JSON.stringify(rfqID),
                    success: function (response) {
                        if (result.length > 0) {
                            DeleteMasterAttachment(result[0].attachmentId);
                        }
                        toastr.success("Rfq Details Deleted Successfully!");
                        $('#currentPage').val(1);
                        FetchRfqList();
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to Delete Rfq Details!", "Error");
                    }
                });
            });
        }
    });
}
function FetchRfqList() {
    $("#tableDiv").show();
    $("#formDiv").hide();
    $('#RfqDetailsForm')[0].reset();
    $("#btnSaveType").show();
    $("#button-main").hide();
    $("#btnSaveAndNew").show();
    $("#ddlIndent").prop('disabled', false);
    $('.select2-custom').val(null).trigger('change');
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    FetchRfqNo(); 
    ResetAttachmentRepeater();
    FetchDataForTable('rfqTable', fetchRfqUrl, orderColumn, orderDir.toUpperCase());
}
$('#rfqTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchRfqList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchRfqList();
});

function SaveRfqVendorDetails() {
    var saveUrl = '/RfqRecipient/AddRfqRecipient';
    $("#btnSaveRfqVendorDetails").on('click', function () {
        var formData = fetchedVendorDataList.map(vendor => ({
            RfqId: rfqId,
            VendorId: vendor.partyId,
            PanNo: vendor.panNo,
            VendorRating: "5",
            MobNo: vendor.mobNo,
            WhatsAppNo: vendor.whatsAppNo,
            EmailId: vendor.email
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

            // Example: Display or send links via WhatsApp
            response.links.forEach(linkInfo => {

                // Send via WhatsApp browser link (optional)
                if (linkInfo.WhatsAppNo) {
                    const message = encodeURIComponent("Please fill your RFQ form: " + linkInfo.Link);
                    const waUrl = `https://wa.me/${linkInfo.WhatsAppNo}?text=${message}`;
                    window.open(waUrl, '_blank');
                }
            });
        },
        error: function (xhr) {
            toastr.error("Failed to send links.", "Error");
        }
    });
}
function GetPreviousQuotesList() {
    let fromStateName = $("#fromState").val().toUpperCase();
    let toStateName = $("#toState").val().toUpperCase();
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
